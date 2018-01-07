import tensorflow as tf
import keras
import numpy as np
import cv2
from keras.models import load_model
from config import *

if productive:
    strg0 = '/gpu:0'
    strg1 = '/gpu:1'
else:
    strg0 = '/gpu:0'
    strg1 = '/gpu:0'


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

session = keras.backend.get_session()

with tf.device(strg0):
    dull_head = load_model('dull_head.net')
    gate_head = load_model('gate_head.net')
    line_head = load_model('line_head.net')
    noise_tail = load_model('noise_tail.net')
    clear_tail = load_model('clear_tail.net')

with tf.device(strg1):
    base_head = load_model('base_head.net')
    base_neck = load_model('base_neck.net')
    base_reader = load_model('base_reader.net')

ip1 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 1))
ip3 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 3))
ip4 = tf.placeholder(dtype=tf.float32, shape=(None, None, None, 4))

with tf.device(strg0):
    dull_place = tf.concat([
        - 512 * tf.ones_like(ip4[:, :, :, 3:4]),
        128 * tf.ones_like(ip4[:, :, :, 3:4]),
        128 * tf.ones_like(ip4[:, :, :, 3:4])
    ], axis=3)
    dull_yuv = RGB2YUV(ip4[:, :, :, 0:3])
    dull_alpha = tf.where(x=tf.zeros_like(ip4[:, :, :, 3:4]), y=tf.ones_like(ip4[:, :, :, 3:4]), condition=tf.less(ip4[:, :, :, 3:4], 128))
    dull_hint = dull_alpha * dull_yuv + (1 - dull_alpha) * dull_place
    dull_head_op = YUV2RGB(gate_head(tf.concat([dull_head(tf.concat([ip1, dull_hint], axis=3))[:, :, :, 0:1], dull_hint], axis=3)))
    line_head_op = line_head(RGB2YUV(ip3)) * 255.0
    noise_tail_op = noise_tail(tf.pad(ip3 / 255.0, [[0, 0], [3, 3], [3, 3], [0, 0]], 'REFLECT'))[:, 3:-3, 3:-3, :] * 255.0
    clear_tail_op = clear_tail(tf.pad(ip3 / 255.0, [[0, 0], [3, 3], [3, 3], [0, 0]], 'REFLECT'))[:, 3:-3, 3:-3, :] * 255.0

with tf.device(strg1):
    p_ip1 = 1 - ip1 / 255.0
    p_ip3 = ip3 / 255.0
    p_ip4 = (ip4[:, :, :, 0:3] / 127.5 - 1) * ip4[:, :, :, 3:4] / 255.0
    features = base_reader(p_ip3)
    feed = []
    feed.append(p_ip1)
    feed.append(p_ip4)
    for item in features:
        feed.append(keras.backend.mean(item, axis=[1, 2]))
    nil0, nil1, base_head_temp = base_head(feed)
    nil2, nil3, base_neck_temp = base_neck(feed)
    base_head_temp = (base_head_temp + [103.939, 116.779, 123.68])[:, :, :, ::-1] / 255.0
    base_head_temp = 1 - tf.image.resize_bilinear(ToGray(base_head_temp), (tf.shape(ip1)[1], tf.shape(ip1)[2]))
    base_head_temp = tf.clip_by_value(base_head_temp, clip_value_min=0.0, clip_value_max=1.0)
    feed[0] = base_head_temp
    nil4, nil5, base_head_temp = base_neck(feed)
    base_head_op = (base_head_temp + [103.939, 116.779, 123.68])[:, :, :, ::-1]
    base_neck_op = (base_neck_temp + [103.939, 116.779, 123.68])[:, :, :, ::-1]

session.run(tf.global_variables_initializer())

dull_head.load_weights('dull_head.net')
gate_head.load_weights('gate_head.net')
line_head.load_weights('line_head.net')
base_head.load_weights('base_head.net')
base_neck.load_weights('base_neck.net')
noise_tail.load_weights('noise_tail.net')
clear_tail.load_weights('clear_tail.net')
base_reader.load_weights('base_reader.net')


def go_head(sketch, global_hint, local_hint):
    return session.run(base_head_op, feed_dict={
        ip1: sketch[None, :, :, None], ip3: global_hint[None, :, :, :], ip4: local_hint[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_dull(sketch, local_hint):
    return session.run(dull_head_op, feed_dict={
        ip1: sketch[None, :, :, None], ip4: local_hint[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_neck(sketch, global_hint, local_hint):
    return session.run(base_neck_op, feed_dict={
        ip1: sketch[None, :, :, None], ip3: global_hint[None, :, :, :], ip4: local_hint[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)


def go_line(x):
    return session.run(line_head_op, feed_dict={
        ip3: x[None, :, :, :]
    })[0, :, :, 0].clip(0, 255).astype(np.uint8)


def go_tail(x, noisy):
    return session.run(noise_tail_op if noisy else clear_tail_op, feed_dict={
        ip3: x[None, :, :, :]
    })[0].clip(0, 255).astype(np.uint8)