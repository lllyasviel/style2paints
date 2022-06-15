import os
import cv2
import numpy as np
import datetime
import pickle
import base64
import json
import gzip
import re
import shutil

from tqdm import tqdm
from cv2.ximgproc import l0Smooth, createGuidedFilter, guidedFilter
from bottle import route, run, static_file, request, BaseRequest

BaseRequest.MEMFILE_MAX = 10000 * 1000

import tensorflow

tensorflow.compat.v1.disable_v2_behavior()
tf = tensorflow.compat.v1


def ToGray(x):
    R = x[:, :, :, 0:1]
    G = x[:, :, :, 1:2]
    B = x[:, :, :, 2:3]
    return 0.30 * R + 0.59 * G + 0.11 * B


def VGG2RGB(x):
    return (x + [103.939, 116.779, 123.68])[:, :, :, ::-1]


def norm_feature(x, core):
    cs0 = tf.shape(core)[1]
    cs1 = tf.shape(core)[2]
    small = tf.image.resize_area(x, (cs0, cs1))
    avged = tf.nn.avg_pool(tf.pad(small, [[0, 0], [2, 2], [2, 2], [0, 0]], 'REFLECT'), [1, 5, 5, 1], [1, 1, 1, 1],
                           'VALID')
    return tf.image.resize_bicubic(avged, tf.shape(x)[1:3])


def blur(x):
    def layer(op):
        def layer_decorated(self, *args, **kwargs):
            # Automatically set a name if not provided.
            name = kwargs.setdefault('name', self.get_unique_name(op.__name__))
            # Figure out the layer inputs.
            if len(self.terminals) == 0:
                raise RuntimeError('No input variables found for layer %s.' % name)
            elif len(self.terminals) == 1:
                layer_input = self.terminals[0]
            else:
                layer_input = list(self.terminals)
            # Perform the operation and get the output.
            layer_output = op(self, layer_input, *args, **kwargs)
            # Add to layer LUT.
            self.layers[name] = layer_output
            # This output is now the input for the next layer.
            self.feed(layer_output)
            # Return self for chained calls.
            return self

        return layer_decorated

    class Smoother(object):
        def __init__(self, inputs, filter_size, sigma):
            self.inputs = inputs
            self.terminals = []
            self.layers = dict(inputs)
            self.filter_size = filter_size
            self.sigma = sigma
            self.setup()

        def setup(self):
            (self.feed('data')
             .conv(name='smoothing'))

        def get_unique_name(self, prefix):
            ident = sum(t.startswith(prefix) for t, _ in self.layers.items()) + 1
            return '%s_%d' % (prefix, ident)

        def feed(self, *args):
            assert len(args) != 0
            self.terminals = []
            for fed_layer in args:
                if isinstance(fed_layer, str):
                    try:
                        fed_layer = self.layers[fed_layer]
                    except KeyError:
                        raise KeyError('Unknown layer name fed: %s' % fed_layer)
                self.terminals.append(fed_layer)
            return self

        def gauss_kernel(self, kernlen=21, nsig=3, channels=1):
            out_filter = np.load('./nets/gau.npy')
            return out_filter

        def make_gauss_var(self, name, size, sigma, c_i):
            kernel = self.gauss_kernel(size, sigma, c_i)
            var = tf.Variable(tf.convert_to_tensor(kernel), name=name)
            return var

        def get_output(self):
            '''Returns the smoother output.'''
            return self.terminals[-1]

        @layer
        def conv(self,
                 input,
                 name,
                 padding='SAME'):
            # Get the number of channels in the input
            c_i = input.get_shape().as_list()[3]
            # Convolution for a given input and kernel
            convolve = lambda i, k: tf.nn.depthwise_conv2d(i, k, [1, 1, 1, 1],
                                                           padding=padding)
            with tf.variable_scope(name) as scope:
                kernel = self.make_gauss_var('gauss_weight', self.filter_size,
                                             self.sigma, c_i)
                output = convolve(input, kernel)
                return output

    return Smoother({'data': tf.pad(x, [[0, 0], [9, 9], [9, 9], [0, 0]], 'SYMMETRIC')}, 7, 2).get_output()[:, 9: -9,
           9: -9, :]


def downsample(x):
    return tf.nn.avg_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')


def nts(x):
    return (x + [103.939, 116.779, 123.68])[:, :, :, ::-1] / 255.0


def np_expand_image(x):
    p = np.pad(x, ((1, 1), (1, 1), (0, 0)), 'symmetric')
    r = []
    r.append(p[:-2, 1:-1, :])
    r.append(p[1:-1, :-2, :])
    r.append(p[1:-1, 1:-1, :])
    r.append(p[1:-1, 2:, :])
    r.append(p[2:, 1:-1, :])
    return np.stack(r, axis=2)


def build_sketch_sparse(x, abs):
    x = x[:, :, None].astype(np.float32)
    expanded = np_expand_image(x)
    distance = x[:, :, None] - expanded
    if abs:
        distance = np.abs(distance)
    weight = 8 - distance
    weight[weight < 0] = 0.0
    weight /= np.sum(weight, axis=2, keepdims=True)
    return weight


def build_repeat_mulsep(x, m, i):
    a = m[:, :, 0]
    b = m[:, :, 1]
    c = m[:, :, 2]
    d = m[:, :, 3]
    e = m[:, :, 4]
    y = x
    for _ in range(i):
        p = tf.pad(y, [[1, 1], [1, 1], [0, 0]], 'SYMMETRIC')
        y = p[:-2, 1:-1, :] * a + p[1:-1, :-2, :] * b + y * c + p[1:-1, 2:, :] * d + p[2:, 1:-1, :] * e
    return y


session = tf.Session()
tf.keras.backend.set_session(session)

ip1 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 1))
ip3 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 3))
ip4 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 4))
ipsp9 = tf.placeholder(dtype=tf.float32, shape=(None, None, 5, 1))
ipsp3 = tf.placeholder(dtype=tf.float32, shape=(None, None, 3))

tf_sparse_op_H = build_repeat_mulsep(ipsp3, ipsp9, 64)
tf_sparse_op_L = build_repeat_mulsep(ipsp3, ipsp9, 16)


def make_graph():
    with gzip.open('./nets/refs.net', 'rb') as fp:
        refs_img = pickle.load(fp)

    tail = tf.keras.models.load_model('./nets/tail.net')
    reader = tf.keras.models.load_model('./nets/reader.net')
    head = tf.keras.models.load_model('./nets/head.net')
    neck = tf.keras.models.load_model('./nets/neck.net')
    inception = tf.keras.models.load_model('./nets/inception.net')
    render_head = tf.keras.models.load_model('./nets/render_head.net')
    render_neck = tf.keras.models.load_model('./nets/render_neck.net')

    tail_op = tail(ip3)
    features = reader(ip3 / 255.0)
    print('Loaded some basic models.')
    feed = [1 - ip1 / 255.0, (ip4[:, :, :, 0:3] / 127.5 - 1) * ip4[:, :, :, 3:4] / 255.0]
    for _ in range(len(features)):
        feed.append(tf.reduce_mean(features[_], axis=[1, 2]))
    nil0, nil1, head_temp = head(feed)
    feed[0] = tf.clip_by_value(1 - tf.image.resize_bilinear(ToGray(VGG2RGB(head_temp) / 255.0), tf.shape(ip1)[1:3]),
                               0.0, 1.0)
    nil4, nil5, head_temp = neck(feed)
    head_op = VGG2RGB(head_temp)
    features_render = inception((ip3 + (downsample(ip1) - blur(downsample(ip1))) * 2.0) / 255.0)
    precessed_feed = [(ip4[:, :, :, 0:3] / 127.5 - 1) * ip4[:, :, :, 3:4] / 255.0] + [
        norm_feature(item, features_render[-1]) for item in features_render]
    nil6, nil7, render_A = render_head([1 - ip1 / 255.0] + precessed_feed)
    nil8, nil9, render_B = render_neck(
        [1 - tf.image.resize_bilinear(ToGray(nts(render_A)), tf.shape(ip1)[1:3])] + precessed_feed)
    render_op = nts(render_B) * 255.0
    print('Loaded - Style2Paints Deep Learning Engine V45 - GPU')

    session.run(tf.global_variables_initializer())

    tail.load_weights('./nets/tail.net')
    head.load_weights('./nets/head.net')
    neck.load_weights('./nets/neck.net')
    reader.load_weights('./nets/reader.net')
    inception.load_weights('./nets/inception.net')
    render_head.load_weights('./nets/render_head.net')
    render_neck.load_weights('./nets/render_neck.net')

    print('Deep learning modules are ready.')

    return tail_op, head_op, render_op, refs_img


tail_op_g, head_op_g, render_op_g, refs_img_g = make_graph()


def go_tail(x):
    def srange(l, s):
        result = []
        iters = int(float(l) / float(s))
        for i in range(iters):
            result.append([i * s, (i + 1) * s])
        result[len(result) - 1][1] = l
        return result

    H, W, C = x.shape
    padded_img = np.pad(x, ((20, 20), (20, 20), (0, 0)), 'symmetric').astype(np.float32) / 255.0
    lines = []
    for hs, he in srange(H, 64):
        items = []
        for ws, we in srange(W, 64):
            items.append(padded_img[hs:he + 40, ws:we + 40, :])
        lines.append(items)
    iex = 0
    result_all_lines = []
    for line in lines:
        result_one_line = []
        for item in line:
            ots = session.run(tail_op_g, feed_dict={ip3: item[None, :, :, :]})[0]
            result_one_line.append(ots[41:-41, 41:-41, :])
            print('Slicing ... ' + str(iex))
            iex += 1
        result_one_line = np.concatenate(result_one_line, axis=1)
        result_all_lines.append(result_one_line)
    result_all_lines = np.concatenate(result_all_lines, axis=0)
    return (result_all_lines * 255.0).clip(0, 255).astype(np.uint8)


def go_head(sketch, global_hint, local_hint):
    return session.run(head_op_g, feed_dict={
        ip1: sketch[None, :, :, None], ip3: global_hint[None, :, :, :], ip4: local_hint[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_render(sketch, segmentation, points):
    return session.run(render_op_g, feed_dict={
        ip1: sketch[None, :, :, None], ip3: segmentation[None, :, :, :], ip4: points[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


print('Deep learning functions are ready.')


def k_resize(x, k):
    if x.shape[0] < x.shape[1]:
        s0 = k
        s1 = int(x.shape[1] * (k / x.shape[0]))
        s1 = s1 - s1 % 64
        _s0 = 16 * s0
        _s1 = int(x.shape[1] * (_s0 / x.shape[0]))
        _s1 = (_s1 + 32) - (_s1 + 32) % 64
    else:
        s1 = k
        s0 = int(x.shape[0] * (k / x.shape[1]))
        s0 = s0 - s0 % 64
        _s1 = 16 * s1
        _s0 = int(x.shape[0] * (_s1 / x.shape[1]))
        _s0 = (_s0 + 32) - (_s0 + 32) % 64
    new_min = min(_s1, _s0)
    raw_min = min(x.shape[0], x.shape[1])
    if new_min < raw_min:
        interpolation = cv2.INTER_AREA
    else:
        interpolation = cv2.INTER_LANCZOS4
    y = cv2.resize(x, (_s1, _s0), interpolation=interpolation)
    return y


def d_resize(x, d, fac=1.0):
    new_min = min(int(d[1] * fac), int(d[0] * fac))
    raw_min = min(x.shape[0], x.shape[1])
    if new_min < raw_min:
        interpolation = cv2.INTER_AREA
    else:
        interpolation = cv2.INTER_LANCZOS4
    y = cv2.resize(x, (int(d[1] * fac), int(d[0] * fac)), interpolation=interpolation)
    return y


def min_resize(x, m):
    if x.shape[0] < x.shape[1]:
        s0 = m
        s1 = int(float(m) / float(x.shape[0]) * float(x.shape[1]))
    else:
        s0 = int(float(m) / float(x.shape[1]) * float(x.shape[0]))
        s1 = m
    new_max = min(s1, s0)
    raw_max = min(x.shape[0], x.shape[1])
    if new_max < raw_max:
        interpolation = cv2.INTER_AREA
    else:
        interpolation = cv2.INTER_LANCZOS4
    y = cv2.resize(x, (s1, s0), interpolation=interpolation)
    return y


def cli_norm(sketch):
    light = np.max(min_resize(sketch, 64), axis=(0, 1), keepdims=True)
    intensity = (light - sketch.astype(np.float32)).clip(0, 255)
    line_intensities = np.sort(intensity[intensity > 16])[::-1]
    line_quantity = float(line_intensities.shape[0])
    intensity /= line_intensities[int(line_quantity * 0.1)]
    intensity *= 0.9
    return (255.0 - intensity * 255.0).clip(0, 255).astype(np.uint8)


def cv2_imwrite(a, b):
    print(a)
    cv2.imwrite(a, b)


def from_png_to_jpg(map):
    if map.shape[2] == 3:
        return map
    color = map[:, :, 0:3].astype(np.float) / 255.0
    alpha = map[:, :, 3:4].astype(np.float) / 255.0
    reversed_color = 1 - color
    final_color = (255.0 - reversed_color * alpha * 255.0).clip(0, 255).astype(np.uint8)
    return final_color


def s_enhance(x, k=2.0):
    p = cv2.cvtColor(x, cv2.COLOR_RGB2HSV).astype(np.float)
    p[:, :, 1] *= k
    p = p.clip(0, 255).astype(np.uint8)
    return cv2.cvtColor(p, cv2.COLOR_HSV2RGB).clip(0, 255)


def ini_hint(x):
    r = np.zeros(shape=(x.shape[0], x.shape[1], 4), dtype=np.uint8)
    return r


def opreate_normal_hint(gird, points, length):
    h = gird.shape[0]
    w = gird.shape[1]
    for point in points:
        x, y, r, g, b = point
        x = int(x * w)
        y = int(y * h)
        l_ = max(0, x - length)
        b_ = max(0, y - length)
        r_ = min(w, x + length + 1)
        t_ = min(h, y + length + 1)
        gird[b_:t_, l_:r_, 2] = r
        gird[b_:t_, l_:r_, 1] = g
        gird[b_:t_, l_:r_, 0] = b
        gird[b_:t_, l_:r_, 3] = 255.0
    return gird


def get_hdr(x):
    def get_hdr_g(x):
        img = x.astype(np.float32)
        mean = np.mean(img)
        h_mean = mean.copy()
        l_mean = mean.copy()
        for i in range(2):
            h_mean = np.mean(img[img >= h_mean])
            l_mean = np.mean(img[img <= l_mean])
        for i in range(2):
            l_mean = np.mean(img[img <= l_mean])
        return l_mean, mean, h_mean

    l_mean = np.zeros(shape=(1, 1, 3), dtype=np.float32)
    mean = np.zeros(shape=(1, 1, 3), dtype=np.float32)
    h_mean = np.zeros(shape=(1, 1, 3), dtype=np.float32)
    for c in range(3):
        l, m, h = get_hdr_g(x[:, :, c])
        l_mean[:, :, c] = l
        mean[:, :, c] = m
        h_mean[:, :, c] = h
    return l_mean, mean, h_mean


def f2(x1, x2, x3, y1, y2, y3, x):
    A = y1 * ((x - x2) * (x - x3)) / ((x1 - x2) * (x1 - x3))
    B = y2 * ((x - x1) * (x - x3)) / ((x2 - x1) * (x2 - x3))
    C = y3 * ((x - x1) * (x - x2)) / ((x3 - x1) * (x3 - x2))
    return A + B + C


print('Tricks loaded.')


def refine_image(image, sketch, origin):
    verbose = False

    def cv_log(name, img):
        if verbose:
            print(name)
            cv2.imshow('cv_log', img.clip(0, 255).astype(np.uint8))
            cv2.imwrite('cv_log.png', img.clip(0, 255).astype(np.uint8))
            cv2.waitKey(0)

    print('Building Sparse Matrix ...')
    sketch = sketch.astype(np.float32)
    sparse_matrix = build_sketch_sparse(sketch, True)
    bright_matrix = build_sketch_sparse(sketch - cv2.GaussianBlur(sketch, (0, 0), 3.0), False)
    guided_matrix = createGuidedFilter(sketch.clip(0, 255).astype(np.uint8), 1, 0.01)
    HDRL, HDRM, HDRH = get_hdr(image)

    def go_guide(x):
        y = x + (x - cv2.GaussianBlur(x, (0, 0), 1)) * 2.0
        for _ in tqdm(range(4)):
            y = guided_matrix.filter(y)
        return y

    def go_refine_sparse(x):
        return session.run(tf_sparse_op_H, feed_dict={ipsp3: x, ipsp9: sparse_matrix})

    def go_refine_bright(x):
        return session.run(tf_sparse_op_L, feed_dict={ipsp3: x, ipsp9: bright_matrix})

    def go_flat(x):
        pia = 32
        y = x.clip(0, 255).astype(np.uint8)
        y = cv2.resize(y, (x.shape[1] // 2, x.shape[0] // 2), interpolation=cv2.INTER_AREA)
        y = np.pad(y, ((pia, pia), (pia, pia), (0, 0)), 'reflect')
        y = l0Smooth(y, None, 0.01)
        y = y[pia:-pia, pia:-pia, :]
        y = cv2.resize(y, (x.shape[1], x.shape[0]), interpolation=cv2.INTER_CUBIC)
        return y

    def go_hdr(x):
        xl, xm, xh = get_hdr(x)
        y = f2(xl, xm, xh, HDRL, HDRM, HDRH, x)
        return y.clip(0, 255)

    def go_blend(BGR, X, m):
        BGR = BGR.clip(0, 255).astype(np.uint8)
        X = X.clip(0, 255).astype(np.uint8)
        YUV = cv2.cvtColor(BGR, cv2.COLOR_BGR2YUV)
        s_l = YUV[:, :, 0].astype(np.float32)
        t_l = X.astype(np.float32)
        r_l = (s_l * t_l / 255.0) if m else np.minimum(s_l, t_l)
        YUV[:, :, 0] = r_l.clip(0, 255).astype(np.uint8)
        return cv2.cvtColor(YUV, cv2.COLOR_YUV2BGR)

    print('Getting Target ...')
    smoothed = d_resize(image, sketch.shape)
    print('Global Optimization ...')
    cv_log('smoothed', smoothed)
    sparse_smoothed = go_refine_sparse(smoothed)
    cv_log('smoothed', sparse_smoothed)
    smoothed = go_guide(sparse_smoothed)
    cv_log('smoothed', smoothed)
    smoothed = go_hdr(smoothed)
    cv_log('smoothed', smoothed)
    print('Decomposition Optimization ...')
    flat = sparse_smoothed.copy()
    cv_log('flat', flat)
    flat = go_refine_bright(flat)
    cv_log('flat', flat)
    flat = go_flat(flat)
    cv_log('flat', flat)
    flat = go_refine_sparse(flat)
    cv_log('flat', flat)
    flat = go_guide(flat)
    cv_log('flat', flat)
    flat = go_hdr(flat)
    cv_log('flat', flat)
    print('Blending Optimization ...')
    cv_log('origin', origin)
    blended_smoothed = go_blend(smoothed, origin, False)
    cv_log('blended_smoothed', blended_smoothed)
    blended_flat = go_blend(flat, origin, True)
    cv_log('blended_flat', blended_flat)
    print('Optimization finished.')
    return smoothed, flat, blended_smoothed, blended_flat


print('Fundamental Methods loaded.')


def get_request_image(name):
    img = request.forms.get(name)
    img = re.sub('^data:image/.+;base64,', '', img)
    img = base64.urlsafe_b64decode(img)
    img = np.fromstring(img, dtype=np.uint8)
    img = cv2.imdecode(img, -1)
    return img


@route('/<filename:path>')
def send_static(filename):
    print(filename)
    return static_file(filename, root='game/')


@route('/upload_sketch', method='POST')
def upload_sketch():
    origin = from_png_to_jpg(get_request_image('sketch'))
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    print('New room ID: ' + ID)
    room_path = './game/rooms/' + ID + '/'
    os.makedirs(room_path, exist_ok=True)
    cv2_imwrite(room_path + 'origin.png', origin)
    sketch = min_resize(origin, 512)
    sketch = np.min(sketch, axis=2)
    sketch = cli_norm(sketch)
    sketch = np.tile(sketch[:, :, None], [1, 1, 3])
    sketch = go_tail(sketch)
    sketch = np.mean(sketch, axis=2)
    cv2_imwrite(room_path + 'sketch.png', sketch)
    return ID + '_' + ID


@route('/request_result', method='POST')
def request_result():
    room = request.forms.get("room")
    room_path = './game/rooms/' + room + '/'
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    points = request.forms.get("points")
    with open(room_path + '/points.' + ID + '.txt', 'wt') as fp:
        fp.write(points)
    points = json.loads(points)
    for _ in range(len(points)):
        points[_][1] = 1 - points[_][1]
    sketch = cv2.imread(room_path + 'sketch.png', cv2.IMREAD_UNCHANGED)
    origin = cv2.imread(room_path + 'origin.png', cv2.IMREAD_GRAYSCALE)
    origin = d_resize(origin, sketch.shape).astype(np.float32)
    low_origin = cv2.GaussianBlur(origin, (0, 0), 3.0)
    high_origin = origin - low_origin
    low_origin = (low_origin / np.median(low_origin) * 255.0).clip(0, 255)
    origin = (low_origin + high_origin).clip(0, 255).astype(np.uint8)
    faceID = int(request.forms.get("faceID")) - 65535
    print(faceID)
    if faceID > -1:
        print('Default reference.')
        face = from_png_to_jpg(refs_img_g[faceID])
    else:
        print('Load reference.')
        face = from_png_to_jpg(get_request_image('face'))
    face = s_enhance(face, 2.0)
    print('request result room = ' + str(room) + ', ID = ' + str(ID))
    print('processing painting in ' + room_path)
    sketch_1024 = k_resize(sketch, 64)
    hints_1024 = opreate_normal_hint(ini_hint(sketch_1024), points, length=2)
    careless = go_head(sketch_1024, k_resize(face, 14), hints_1024)
    smoothed_careless, flat_careless, blended_smoothed_careless, blended_flat_careless = refine_image(careless, sketch,
                                                                                                      origin)
    cv2_imwrite(room_path + '/' + ID + '.smoothed_careless.png', smoothed_careless)
    cv2_imwrite(room_path + '/' + ID + '.flat_careless.png', flat_careless)
    cv2_imwrite(room_path + '/' + ID + '.blended_smoothed_careless.png', blended_smoothed_careless)
    cv2_imwrite(room_path + '/' + ID + '.blended_flat_careless.png', blended_flat_careless)
    print('Stage I finished.')
    careful = go_render(sketch_1024, d_resize(flat_careless, sketch_1024.shape, 0.5), hints_1024)
    smoothed_careful, flat_careful, blended_smoothed_careful, blended_flat_careful = refine_image(careful, sketch,
                                                                                                  origin)
    cv2_imwrite(room_path + '/' + ID + '.smoothed_careful.png', smoothed_careful)
    cv2_imwrite(room_path + '/' + ID + '.flat_careful.png', flat_careful)
    cv2_imwrite(room_path + '/' + ID + '.blended_smoothed_careful.png', blended_smoothed_careful)
    cv2_imwrite(room_path + '/' + ID + '.blended_flat_careful.png', blended_flat_careful)
    print('Stage II finished.')
    return room + '_' + ID


print('Start Serving.')
print('Open webpage http://127.0.0.1:8233/index.html to use the software.')

run(host="0.0.0.0", port=8233)

