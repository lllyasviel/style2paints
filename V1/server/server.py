chainer_GPU_ID = 0
tensorflow_GPU_ID = 0
k_between_tf_and_chainer = 0.8
import sys
is_GPU = (len(sys.argv) == 1)

import time
from gevent import monkey; monkey.patch_all()
from bottle import route, run, static_file, request, BaseRequest
import base64
import re
import numpy as np
import tensorflow as tf
import cv2
from keras.layers.core import K
K.set_learning_phase(0)
import random
import datetime
from keras.models import load_model
import threading

seed = random.randint(0, 2**31 - 1)
tf.set_random_seed(seed)
np.random.seed(seed)
random.seed(seed)
BaseRequest.MEMFILE_MAX = 10000 * 1000
chainer_ID = chainer_GPU_ID

import chainer
import chainer.links as L
import chainer.functions as F
class GoogLeNet(chainer.Chain):
    def __init__(self):
        super(GoogLeNet, self).__init__(
            conv1=L.Convolution2D(3, 64, 7, stride=2, pad=3, nobias=True),
            norm1=L.BatchNormalization(64),
            conv2=L.Convolution2D(64, 192, 3, pad=1, nobias=True),
            norm2=L.BatchNormalization(192),
            inc3a=L.InceptionBN(192, 64, 64, 64, 64, 96, 'avg', 32),
            inc3b=L.InceptionBN(256, 64, 64, 96, 64, 96, 'avg', 64),
            inc3c=L.InceptionBN(320, 0, 128, 160, 64, 96, 'max', stride=2),
            inc4a=L.InceptionBN(576, 224, 64, 96, 96, 128, 'avg', 128),
            inc4b=L.InceptionBN(576, 192, 96, 128, 96, 128, 'avg', 128),
            inc4c=L.InceptionBN(576, 128, 128, 160, 128, 160, 'avg', 128),
            inc4d=L.InceptionBN(576, 64, 128, 192, 160, 192, 'avg', 128),
            inc4e=L.InceptionBN(576, 0, 128, 192, 192, 256, 'max', stride=2),
            inc5a=L.InceptionBN(1024, 352, 192, 320, 160, 224, 'avg', 128),
            inc5b=L.InceptionBN(1024, 352, 192, 320, 192, 224, 'max', 128),
            out_tag=L.Linear(1024 + 8, 3000),

            conva=L.Convolution2D(576, 128, 1, nobias=True),
            norma=L.BatchNormalization(128),
            lina=L.Linear(2048, 1024, nobias=True),
            norma2=L.BatchNormalization(1024),
            out_a_tag=L.Linear(1024 + 8, 3000),

            convb=L.Convolution2D(576, 128, 1, nobias=True),
            normb=L.BatchNormalization(128),
            linb=L.Linear(2048, 1024, nobias=True),
            normb2=L.BatchNormalization(1024),
            out_b_tag=L.Linear(1024 + 8, 3000),
        )

    def forward(self, x):

        h = F.max_pooling_2d(F.relu(self.norm1(self.conv1(x))), 3, stride=2, pad=1) # 64 * 57 * 57
        hint_s57c64_0 = F.reshape(F.average_pooling_2d(h,57),(64,))

        h = F.max_pooling_2d(F.relu(self.norm2(self.conv2(h))), 3, stride=2, pad=1) # 192 * 29 * 29
        hint_s29c192_0 = F.reshape(F.average_pooling_2d(h, 29), (192,))

        h = self.inc3a(h) # 256 * 29 * 29
        hint_s29c256_0 = F.reshape(F.average_pooling_2d(h, 29), (256,))

        h = self.inc3b(h) # 320 * 29 * 29
        hint_s29c320_0 = F.reshape(F.average_pooling_2d(h, 29), (320,))

        h = self.inc3c(h) # 576 * 15 * 15
        hint_s15c576_0 = F.reshape(F.average_pooling_2d(h, 15), (576,))

        h = self.inc4a(h) # 576 * 15 * 15
        hint_s15c576_1 = F.reshape(F.average_pooling_2d(h, 15), (576,))

        h = self.inc4b(h) # 576 * 15 * 15
        hint_s15c576_2 = F.reshape(F.average_pooling_2d(h, 15), (576,))

        h = self.inc4c(h) # 576 * 15 * 15
        hint_s15c576_3 = F.reshape(F.average_pooling_2d(h, 15), (576,))

        h = self.inc4d(h) # 576 * 15 * 15
        hint_s15c576_4 = F.reshape(F.average_pooling_2d(h, 15), (576,))

        h = self.inc4e(h) # 1024 * 8 * 8
        hint_s8c1024_0 = F.reshape(F.average_pooling_2d(h, 8), (1024,))

        h = self.inc5a(h) # 1024 * 8 * 8
        hint_s8c1024_1 = F.reshape(F.average_pooling_2d(h, 8), (1024,))

        h = self.inc5b(h) # 1024 * 8 * 8
        hint_s8c1024_2 = F.reshape(F.average_pooling_2d(h, 8), (1024,))

        return hint_s57c64_0,hint_s29c192_0,hint_s29c256_0,hint_s29c320_0,hint_s15c576_0,hint_s15c576_1,hint_s15c576_2,hint_s15c576_3,hint_s15c576_4,hint_s8c1024_0,hint_s8c1024_1,hint_s8c1024_2
google_net = GoogLeNet()
chainer.serializers.load_npz('google_net.net', google_net)

def ini_chainer():
    chainer.cuda.get_device_from_id(chainer_ID).use()
    google_net.to_gpu(chainer_ID)
    print('chainer initialized')

if is_GPU:
    session = tf.Session(config=tf.ConfigProto(gpu_options=tf.GPUOptions(visible_device_list=str(tensorflow_GPU_ID),
                                                                         per_process_gpu_memory_fraction=k_between_tf_and_chainer)))
    K.set_session(session)
    chainer_thread = threading.Thread(target=ini_chainer)
    chainer_thread.start()
else:
    session = K.get_session()

EPS = 1e-12
lr = 1e-6
beta1 = 0.5

base_generator = load_model('base_generator.net')
style2paints = load_model('style2paints.net')

sketch_ref_input_448 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 1))
local_hint_input_448 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 3))

combined_input_448 = tf.concat([sketch_ref_input_448,local_hint_input_448], axis=3)
combined_output = style2paints(combined_input_448)

hint_s57c64_0 = tf.placeholder(dtype=tf.float32, shape=(None, 64))
hint_s29c192_0 = tf.placeholder(dtype=tf.float32, shape=(None, 192))
hint_s29c256_0 = tf.placeholder(dtype=tf.float32, shape=(None, 256))
hint_s29c320_0 = tf.placeholder(dtype=tf.float32, shape=(None, 320))
hint_s15c576_0 = tf.placeholder(dtype=tf.float32, shape=(None, 576))
hint_s15c576_1 = tf.placeholder(dtype=tf.float32, shape=(None, 576))
hint_s15c576_2 = tf.placeholder(dtype=tf.float32, shape=(None, 576))
hint_s15c576_3 = tf.placeholder(dtype=tf.float32, shape=(None, 576))
hint_s15c576_4 = tf.placeholder(dtype=tf.float32, shape=(None, 576))
hint_s8c1024_0 = tf.placeholder(dtype=tf.float32, shape=(None, 1024))
hint_s8c1024_1 = tf.placeholder(dtype=tf.float32, shape=(None, 1024))
hint_s8c1024_2 = tf.placeholder(dtype=tf.float32, shape=(None, 1024))

local_drag_output, global_drag_output, paint_output = base_generator([
    sketch_ref_input_448,
    local_hint_input_448,
    hint_s57c64_0,
    hint_s29c192_0,
    hint_s29c256_0,
    hint_s29c320_0,
    hint_s15c576_0,
    hint_s15c576_1,
    hint_s15c576_2,
    hint_s15c576_3,
    hint_s15c576_4,
    hint_s8c1024_0,
    hint_s8c1024_1,
    hint_s8c1024_2
])

session.run(tf.global_variables_initializer())

base_generator.load_weights('base_generator.net')
style2paints.load_weights('style2paints.net')

@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root='game/')


@route('/')
def send_static():
    return static_file("index.html", root='game/')


@route('/paint', method='POST')
def do_paint():
    print('received')

    sketchID = request.forms.get("sketchID")

    if sketchID == 'new':
        dstr = datetime.datetime.now().strftime('%b_%d_%H_%M_%S') + '__' + str(np.random.randint(100, 999))
        sketchDataURL = request.forms.get("sketch")
        sketchDataURL = re.sub('^data:image/.+;base64,', '', sketchDataURL)
        sketchDataURL = base64.urlsafe_b64decode(sketchDataURL)
        sketchDataURL = np.fromstring(sketchDataURL, dtype=np.uint8)
        sketchDataURL = cv2.imdecode(sketchDataURL, -1)
        cv2.imwrite('record/' + dstr + '.sketch.png', sketchDataURL)
    else:
        dstr = sketchID
        sketchDataURL = cv2.imread('record/' + dstr + '.sketch.png', cv2.IMREAD_UNCHANGED)

    referenceID = request.forms.get("referenceID")

    if referenceID == 'new':
        referenceDataURL = request.forms.get("reference")
        referenceDataURL = re.sub('^data:image/.+;base64,', '', referenceDataURL)
        referenceDataURL = base64.urlsafe_b64decode(referenceDataURL)
        referenceDataURL = np.fromstring(referenceDataURL, dtype=np.uint8)
        referenceDataURL = cv2.imdecode(referenceDataURL, -1)
        referenceID = str(np.random.randint(100, 999))
        cv2.imwrite('record/' + dstr + '_' + referenceID + '.reference.png', referenceDataURL)
    else:
        referenceDataURL = cv2.imread('record/' + dstr + '_' + referenceID + '.reference.png', cv2.IMREAD_UNCHANGED)

    hintDataURL = request.forms.get("hint")
    hintDataURL = re.sub('^data:image/.+;base64,', '', hintDataURL)
    hintDataURL = base64.urlsafe_b64decode(hintDataURL)
    hintDataURL = np.fromstring(hintDataURL, dtype=np.uint8)
    hintDataURL = cv2.imdecode(hintDataURL, -1)
    cv2.imwrite('record/' + dstr + '_' + str(np.random.randint(100, 999)) + '.hint.png', hintDataURL)

    versionURL = request.forms.get("version")
    denoiseURL = request.forms.get("denoise")

    low_level_scale = 28
    shifter = 2.0
    up_level = True
    interpolation = cv2.INTER_AREA
    high_level_scale = 32
    high_interpolation = cv2.INTER_AREA

    if versionURL == '1':
        low_level_scale = 16
        shifter = 1.3
        up_level = True
        interpolation = cv2.INTER_AREA
        high_level_scale = 32
        high_interpolation = cv2.INTER_AREA

    if versionURL == '2':
        low_level_scale = 28
        shifter = 1.2
        up_level = True
        interpolation = cv2.INTER_AREA
        high_level_scale = 32
        high_interpolation = cv2.INTER_AREA

    if versionURL == '3':
        low_level_scale = 48
        shifter = 1.1
        up_level = True
        interpolation = cv2.INTER_LANCZOS4
        high_level_scale = 64
        high_interpolation = cv2.INTER_LANCZOS4

    if versionURL == '4':
        low_level_scale = 64
        shifter = 1.0
        up_level = False
        interpolation = cv2.INTER_LANCZOS4
        high_level_scale = 64
        high_interpolation = cv2.INTER_LANCZOS4

    raw_sketch = from_png_to_jpg(sketchDataURL)
    raw_sketch_shape = raw_sketch.shape

    shape_x = raw_sketch_shape[0]
    shape_y = raw_sketch_shape[1]
    if shape_x > shape_y:
        new_shape_x = 512.0 / shape_y * shape_x
        new_shape_y = 512.0
    else:
        new_shape_x = 512.0
        new_shape_y = 512.0 / shape_x * shape_y
    raw_sketch_shape = (int(new_shape_x),int(new_shape_y))

    raw_sketch = cv2.cvtColor(raw_sketch,cv2.COLOR_RGB2GRAY)
    normed_sketch = norm_sketch(raw_sketch,denoiseURL)

    sketch = unet_resize(normed_sketch, low_level_scale, interpolation)
    sketch = sketch.astype(np.float)
    sketch = 1 - (sketch / 255.0)
    sketch = sketch[None,:,:,None]

    reference = from_png_to_jpg(referenceDataURL)
    reference = cv2.resize(reference, (224,224), interpolation=cv2.INTER_AREA)
    reference = reference.astype(np.float32)
    reference = reference / 255.0
    reference = reference.transpose((2, 0, 1))[None, :, :, :]

    t = time.time()

    if is_GPU:
        with chainer.no_backprop_mode():
            with chainer.using_config('train', False):
                vhint_s57c64_0, vhint_s29c192_0, vhint_s29c256_0, vhint_s29c320_0, vhint_s15c576_0, vhint_s15c576_1, vhint_s15c576_2, vhint_s15c576_3, vhint_s15c576_4, vhint_s8c1024_0, vhint_s8c1024_1, vhint_s8c1024_2 = google_net.forward(
                    chainer.cuda.to_gpu(reference, chainer_ID))
    else:
        with chainer.no_backprop_mode():
            with chainer.using_config('train', False):
                vhint_s57c64_0, vhint_s29c192_0, vhint_s29c256_0, vhint_s29c320_0, vhint_s15c576_0, vhint_s15c576_1, vhint_s15c576_2, vhint_s15c576_3, vhint_s15c576_4, vhint_s8c1024_0, vhint_s8c1024_1, vhint_s8c1024_2 = google_net.forward(
                    reference)

    print(time.time() - t)

    hint = hintDataURL[:, :, 0:4]

    color = hint[:,:,0:3]
    color = cv2.cvtColor(color,cv2.COLOR_RGB2HSV).astype(np.float)
    color[:,:,1] *= shifter
    color = color.clip(0,255).astype(np.uint8)
    color = cv2.cvtColor(color,cv2.COLOR_HSV2RGB)
    hint[:, :, 0:3] = color

    hint = cv2.resize(hint, (sketch.shape[2], sketch.shape[1]), cv2.INTER_AREA)
    hint = hint.astype(np.float)
    local_hint = hint[:,:,0:3]
    alpha = hint[:, :, 3] / 255.0
    local_hint = local_hint - 127
    local_hint = local_hint / 128.0
    for _ in range(3):
        local_hint[:, :, _] = np.multiply(local_hint[:, :, _], alpha)
    hint = local_hint[None, :, :, :]

    t = time.time()

    if is_GPU:
        final = session.run(paint_output, feed_dict={
            sketch_ref_input_448: sketch,
            local_hint_input_448: hint,
            hint_s57c64_0: chainer.cuda.to_cpu(vhint_s57c64_0.data)[None],
            hint_s29c192_0: chainer.cuda.to_cpu(vhint_s29c192_0.data)[None],
            hint_s29c256_0: chainer.cuda.to_cpu(vhint_s29c256_0.data)[None],
            hint_s29c320_0: chainer.cuda.to_cpu(vhint_s29c320_0.data)[None],
            hint_s15c576_0: chainer.cuda.to_cpu(vhint_s15c576_0.data)[None],
            hint_s15c576_1: chainer.cuda.to_cpu(vhint_s15c576_1.data)[None],
            hint_s15c576_2: chainer.cuda.to_cpu(vhint_s15c576_2.data)[None],
            hint_s15c576_3: chainer.cuda.to_cpu(vhint_s15c576_3.data)[None],
            hint_s15c576_4: chainer.cuda.to_cpu(vhint_s15c576_4.data)[None],
            hint_s8c1024_0: chainer.cuda.to_cpu(vhint_s8c1024_0.data)[None],
            hint_s8c1024_1: chainer.cuda.to_cpu(vhint_s8c1024_1.data)[None],
            hint_s8c1024_2: chainer.cuda.to_cpu(vhint_s8c1024_2.data)[None]
        })
    else:
        final = session.run(paint_output, feed_dict={
            sketch_ref_input_448: sketch,
            local_hint_input_448: hint,
            hint_s57c64_0: vhint_s57c64_0.data[None],
            hint_s29c192_0: vhint_s29c192_0.data[None],
            hint_s29c256_0: vhint_s29c256_0.data[None],
            hint_s29c320_0: vhint_s29c320_0.data[None],
            hint_s15c576_0: vhint_s15c576_0.data[None],
            hint_s15c576_1: vhint_s15c576_1.data[None],
            hint_s15c576_2: vhint_s15c576_2.data[None],
            hint_s15c576_3: vhint_s15c576_3.data[None],
            hint_s15c576_4: vhint_s15c576_4.data[None],
            hint_s8c1024_0: vhint_s8c1024_0.data[None],
            hint_s8c1024_1: vhint_s8c1024_1.data[None],
            hint_s8c1024_2: vhint_s8c1024_2.data[None]
        })

    print(time.time() - t)

    final = final[0]
    final += [103.939, 116.779, 123.68]
    final = final[:, :, ::-1]
    final = final.clip(0,255).astype(np.uint8)

    t = time.time()

    if up_level:
        sketch = unet_resize(normed_sketch,high_level_scale,high_interpolation)
        final = cv2.resize(final, (sketch.shape[1], sketch.shape[0]), cv2.INTER_LANCZOS4)
        final = cv2.cvtColor(final, cv2.COLOR_RGB2YUV)
        final = final[None, :, :, :]
        sketch = sketch[None, :, :, None]
        fin = session.run(combined_output,feed_dict={
            sketch_ref_input_448: sketch,
            local_hint_input_448: final
        })[0].clip(0,255).astype(np.uint8)
        fin = cv2.cvtColor(fin, cv2.COLOR_YUV2RGB)
    else:
        fin = final

    print(time.time() - t)

    fin = cv2.cvtColor(fin, cv2.COLOR_RGB2HSV).astype(np.float)
    fin[:, :, 1] /= 0.9
    fin = fin.clip(0, 255).astype(np.uint8)
    fin = cv2.cvtColor(fin, cv2.COLOR_HSV2RGB)

    fin = cv2.resize(fin, (raw_sketch_shape[1], raw_sketch_shape[0]), cv2.INTER_LANCZOS4)
    cv2.imwrite('record/' + dstr + '.fin.jpg', fin)
    result_path = 'results/' + dstr + '.jpg'
    cv2.imwrite('game/' + result_path, fin)

    return dstr + '*' + referenceID


def from_png_to_jpg(map):
    color = map[:, :, 0:3].astype(np.float) / 255.0
    alpha = map[:, :, 3:4].astype(np.float) / 255.0
    reversed_color = 1 - color
    final_color = (255.0 - reversed_color * alpha * 255.0).clip(0,255).astype(np.uint8)
    return final_color


def unet_resize(image1,s_size=32, interpolation=cv2.INTER_AREA):
    if image1.shape[0] < image1.shape[1]:
        s0 = s_size
        s1 = int(image1.shape[1] * (s_size / image1.shape[0]))
        s1 = s1 - s1 % 64
        _s0 = 16 * s0
        _s1 = int(image1.shape[1] * (_s0 / image1.shape[0]))
        _s1 = (_s1 + 32) - (_s1 + 32) % 64
    else:
        s1 = s_size
        s0 = int(image1.shape[0] * (s_size / image1.shape[1]))
        s0 = s0 - s0 % 64
        _s1 = 16 * s1
        _s0 = int(image1.shape[0] * (_s1 / image1.shape[1]))
        _s0 = (_s0 + 32) - (_s0 + 32) % 64
    return cv2.resize(image1, (_s1, _s0), interpolation=interpolation)


def norm_sketch(raw_sketch,denoise):
    tiny_map = cv2.resize(raw_sketch, (64, 64), cv2.INTER_AREA).astype(np.float)
    tiny_min = np.min(tiny_map)
    tiny_max = np.max(tiny_map)
    tiny_range = tiny_max - tiny_min
    sketch = raw_sketch.astype(np.float)
    sketch -= tiny_min
    sketch /= tiny_range
    if denoise == 'true':
        sketch /= 0.9
    sketch = np.power(sketch.clip(0,1), 2)
    sketch *= 255.0
    return sketch.clip(0,255).astype(np.uint8)

run(host="0.0.0.0", port=8000, server='gevent')