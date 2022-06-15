import tensorflow

tensorflow.compat.v1.disable_v2_behavior()
tf = tensorflow.compat.v1

import keras
import numpy as np
from config import *
from keras.models import load_model
from smoother import *
import keras.backend as K
from models import *


def ToGray(x):
    R = x[:, :, :, 0:1]
    G = x[:, :, :, 1:2]
    B = x[:, :, :, 2:3]
    return 0.30 * R + 0.59 * G + 0.11 * B


def RGB2YUV(x):
    R = x[:, :, :, 0:1]
    G = x[:, :, :, 1:2]
    B = x[:, :, :, 2:3]
    Y = 0.299 * R + 0.587 * G + 0.114 * B
    U = 0.492 * (B - Y) + 128
    V = 0.877 * (R - Y) + 128
    return tf.concat([Y, U, V], axis=3)


def YUV2RGB(x):
    Y = x[:, :, :, 0:1]
    U = x[:, :, :, 1:2]
    V = x[:, :, :, 2:3]
    R = Y + 1.140 * (V - 128)
    G = Y - 0.394 * (U - 128) - 0.581 * (V - 128)
    B = Y + 2.032 * (U - 128)
    return tf.concat([R, G, B], axis=3)


def VGG2RGB(x):
    return (x + [103.939, 116.779, 123.68])[:, :, :, ::-1]


def blur(x):
    return Smoother({'data': tf.pad(x, [[0, 0], [9, 9], [9, 9], [0, 0]], 'SYMMETRIC')}, 7, 2).get_output()[:, 9: -9, 9: -9, :]


def norm_feature(x, core):
    cs0 = tf.shape(core)[1]
    cs1 = tf.shape(core)[2]
    small = tf.image.resize_area(x, (cs0, cs1))
    avged = tf.nn.avg_pool(tf.pad(small, [[0, 0], [2, 2], [2, 2], [0, 0]], 'REFLECT'), [1, 5, 5, 1], [1, 1, 1, 1], 'VALID')
    return tf.image.resize_bicubic(avged, tf.shape(x)[1:3])


def upsample(x):
    return K.resize_images(x, 2, 2, 'channels_last')


def downsample(x):
    return tf.nn.avg_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')


def nts(x):
    return (x + [103.939, 116.779, 123.68])[:, :, :, ::-1] / 255.0


session = keras.backend.get_session()

ip1 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 1))
ip3 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 3))
ip4 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 4))

print('1')

vector = make_diff_net()
vector_op = 255.0 - tf.nn.sigmoid(vector(ip3 / 255.0)) * 255.0

print('4')

reader = load_model('./nets/reader.net')
features = reader(ip3 / 255.0)

print('5')

head = load_model('./nets/head.net')
feed = [1 - ip1 / 255.0, (ip4[:, :, :, 0:3] / 127.5 - 1) * ip4[:, :, :, 3:4] / 255.0]
for _ in range(len(features)):
    feed.append(keras.backend.mean(features[_], axis=[1, 2]))
nil0, nil1, head_temp = head(feed)

print('6')

neck = load_model('./nets/neck.net')
nil2, nil3, neck_temp = neck(feed)
feed[0] = tf.clip_by_value(1 - tf.image.resize_bilinear(ToGray(VGG2RGB(head_temp) / 255.0), tf.shape(ip1)[1:3]), 0.0, 1.0)
nil4, nil5, head_temp = neck(feed)
head_op = VGG2RGB(head_temp)
neck_op = VGG2RGB(neck_temp)

print('7')

inception = load_model('./nets/inception.net')
features_render = inception((ip3 + (downsample(ip1) - blur(downsample(ip1))) * 2.0) / 255.0)
precessed_feed = [(ip4[:, :, :, 0:3] / 127.5 - 1) * ip4[:, :, :, 3:4] / 255.0] + [
    norm_feature(item, features_render[-1]) for item in features_render]

print('8')

render_head = load_model('./nets/render_head.net')
render_neck = load_model('./nets/render_neck.net')
nil6, nil7, render_A = render_head([1 - ip1 / 255.0] + precessed_feed)
nil8, nil9, render_B = render_neck(
    [1 - tf.image.resize_bilinear(ToGray(nts(render_A)), tf.shape(ip1)[1:3])] + precessed_feed)
render_op = nts(render_B) * 255.0

print('9')

tail = load_model('./nets/tail.net')
pads = 7
tail_op = tail(tf.pad(ip3 / 255.0, [[0, 0], [pads, pads], [pads, pads], [0, 0]], 'REFLECT'))[:, pads * 2:-pads * 2, pads * 2:-pads * 2, :][:, 1:-1, 1:-1, :] * 255.0

print('10')


vgg7 = load_model('./nets/vgg7.net')
pads = 7
vgg7_op = vgg7(tf.pad(ip1 / 255.0, [[0, 0], [pads, pads], [pads, pads], [0, 0]], 'REFLECT'))[:, pads:-pads, pads:-pads, :] * 255.0

print('11')


mat = make_unet512()
mat_op = mat(ip3 / 255.0) * 255.0

print('11')

norm = load_model('./nets/norm.net')
norm_op = norm(ip1 / 255.0) * 255.0

print('12')

session.run(tf.global_variables_initializer())

print('begin load')


tail.load_weights('./nets/tail.net')
vgg7.load_weights('./nets/vgg7.net')
head.load_weights('./nets/head.net')
neck.load_weights('./nets/neck.net')
reader.load_weights('./nets/reader.net')
vector.load_weights('./nets/vector.net')
render_head.load_weights('./nets/render_head.net')
render_neck.load_weights('./nets/render_neck.net')
inception.load_weights('./nets/inception.net')
mat.load_weights('./nets/mat.net')
norm.load_weights('./nets/norm.net')


def go_head(sketch, global_hint, local_hint):
    return session.run(head_op, feed_dict={
        ip1: sketch[None, :, :, None], ip3: global_hint[None, :, :, :], ip4: local_hint[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_render(sketch, segmentation, points):
    return session.run(render_op, feed_dict={
        ip1: sketch[None, :, :, None], ip3: segmentation[None, :, :, :], ip4: points[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_tail(x):
    return session.run(tail_op, feed_dict={
        ip3: x[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_vgg7(x):
    return session.run(vgg7_op, feed_dict={
        ip1: x[None, :, :, None]
    })[0, :, :, 0].clip(0, 255).astype(np.uint8)


def go_vector(x):
    return session.run(vector_op, feed_dict={
        ip3: x[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_mat(x):
    return session.run(mat_op, feed_dict={
        ip3: x[None, :, :, :]
    })[0, :, :, 0].clip(0, 255).astype(np.uint8)


def go_norm(x):
    return session.run(norm_op, feed_dict={
        ip1: x[None, :, :, None]
    })[0].clip(0, 255).astype(np.uint8)

