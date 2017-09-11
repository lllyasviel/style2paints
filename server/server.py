chainer_GPU_ID = 0
tensorflow_GPU_ID = 0
k_between_tf_and_chainer = 0.5

from bottle import route, run, static_file, request, BaseRequest
import base64
import re
import numpy as np
import tensorflow as tf
import cv2
from keras.layers.core import K
K.set_learning_phase(0)
import time
import random
import os
import datetime
from keras.models import Model,load_model
from keras.layers import Input, Conv2D, MaxPooling2D
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
class UNET(chainer.Chain):

    def __init__(self):
        super(UNET, self).__init__(
            c0=L.Convolution2D(4, 32, 3, 1, 1),
            c1=L.Convolution2D(32, 64, 4, 2, 1),
            c2=L.Convolution2D(64, 64, 3, 1, 1),
            c3=L.Convolution2D(64, 128, 4, 2, 1),
            c4=L.Convolution2D(128, 128, 3, 1, 1),
            c5=L.Convolution2D(128, 256, 4, 2, 1),
            c6=L.Convolution2D(256, 256, 3, 1, 1),
            c7=L.Convolution2D(256, 512, 4, 2, 1),
            c8=L.Convolution2D(512, 512, 3, 1, 1),

            dc8=L.Deconvolution2D(1024, 512, 4, 2, 1),
            dc7=L.Convolution2D(512, 256, 3, 1, 1),
            dc6=L.Deconvolution2D(512, 256, 4, 2, 1),
            dc5=L.Convolution2D(256, 128, 3, 1, 1),
            dc4=L.Deconvolution2D(256, 128, 4, 2, 1),
            dc3=L.Convolution2D(128, 64, 3, 1, 1),
            dc2=L.Deconvolution2D(128, 64, 4, 2, 1),
            dc1=L.Convolution2D(64, 32, 3, 1, 1),
            dc0=L.Convolution2D(64, 3, 3, 1, 1),

            bnc0=L.BatchNormalization(32),
            bnc1=L.BatchNormalization(64),
            bnc2=L.BatchNormalization(64),
            bnc3=L.BatchNormalization(128),
            bnc4=L.BatchNormalization(128),
            bnc5=L.BatchNormalization(256),
            bnc6=L.BatchNormalization(256),
            bnc7=L.BatchNormalization(512),
            bnc8=L.BatchNormalization(512),

            bnd8=L.BatchNormalization(512),
            bnd7=L.BatchNormalization(256),
            bnd6=L.BatchNormalization(256),
            bnd5=L.BatchNormalization(128),
            bnd4=L.BatchNormalization(128),
            bnd3=L.BatchNormalization(64),
            bnd2=L.BatchNormalization(64),
            bnd1=L.BatchNormalization(32)
            # l = L.Linear(3*3*256, 2)'
        )

    def calc(self, x):
        e0 = F.relu(self.bnc0(self.c0(x)))
        e1 = F.relu(self.bnc1(self.c1(e0)))
        e2 = F.relu(self.bnc2(self.c2(e1)))
        del e1
        e3 = F.relu(self.bnc3(self.c3(e2)))
        e4 = F.relu(self.bnc4(self.c4(e3)))
        del e3
        e5 = F.relu(self.bnc5(self.c5(e4)))
        e6 = F.relu(self.bnc6(self.c6(e5)))
        del e5
        e7 = F.relu(self.bnc7(self.c7(e6)))
        e8 = F.relu(self.bnc8(self.c8(e7)))

        d8 = F.relu(self.bnd8(self.dc8(F.concat([e7, e8]))))
        del e7, e8
        d7 = F.relu(self.bnd7(self.dc7(d8)))
        del d8
        d6 = F.relu(self.bnd6(self.dc6(F.concat([e6, d7]))))
        del d7, e6
        d5 = F.relu(self.bnd5(self.dc5(d6)))
        del d6
        d4 = F.relu(self.bnd4(self.dc4(F.concat([e4, d5]))))
        del d5, e4
        d3 = F.relu(self.bnd3(self.dc3(d4)))
        del d4
        d2 = F.relu(self.bnd2(self.dc2(F.concat([e2, d3]))))
        del d3, e2
        d1 = F.relu(self.bnd1(self.dc1(d2)))
        del d2
        d0 = self.dc0(F.concat([e0, d1]))

        return d0
google_net = GoogLeNet()
paintschainer = UNET()
chainer.serializers.load_npz('google_net.net', google_net)
chainer.serializers.load_npz('paintschainer.net', paintschainer)

def ini_chainer():
    chainer.cuda.get_device(chainer_ID).use()
    google_net.to_gpu(chainer_ID)
    paintschainer.to_gpu(chainer_ID)
    print('chainer initialized')

chainer_thread = threading.Thread(target=ini_chainer)
chainer_thread.start()

session = tf.Session(config=tf.ConfigProto(gpu_options=tf.GPUOptions(visible_device_list=str(tensorflow_GPU_ID),per_process_gpu_memory_fraction=k_between_tf_and_chainer)))
K.set_session(session)
EPS = 1e-12
lr = 1e-6
beta1 = 0.5

with tf.variable_scope("generator"):
    base_generator = load_model('base_generator.net')

sketch_ref_input_448 = tf.placeholder(dtype=tf.float32, shape=(None, 448, 448, 1))
local_hint_input_448 = tf.placeholder(dtype=tf.float32, shape=(None, 448, 448, 3))
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


@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root='game/')


@route('/')
def send_static():
    return static_file("index.html", root='game/')


@route('/paint', method='POST')
def do_paint():
    dstr = datetime.datetime.now().strftime('%b%d_%H%M%S') + str(np.random.randint(10000,99999))

    sketchDataURL = request.forms.get("sketch")
    sketchDataURL = re.sub('^data:image/.+;base64,', '', sketchDataURL)
    sketchDataURL = base64.b64decode(sketchDataURL)
    sketchDataURL = np.fromstring(sketchDataURL, dtype=np.uint8)
    sketchDataURL = cv2.imdecode(sketchDataURL, -1)

    referenceDataURL = request.forms.get("reference")
    referenceDataURL = re.sub('^data:image/.+;base64,', '', referenceDataURL)
    referenceDataURL = base64.b64decode(referenceDataURL)
    referenceDataURL = np.fromstring(referenceDataURL, dtype=np.uint8)
    referenceDataURL = cv2.imdecode(referenceDataURL, -1)

    hintDataURL = request.forms.get("hint")
    hintDataURL = re.sub('^data:image/.+;base64,', '', hintDataURL)
    hintDataURL = base64.b64decode(hintDataURL)
    hintDataURL = np.fromstring(hintDataURL, dtype=np.uint8)
    hintDataURL = cv2.imdecode(hintDataURL, -1)

    cv2.imwrite('record/' + dstr + '.sketch.png', sketchDataURL)
    cv2.imwrite('record/' + dstr + '.reference.png', referenceDataURL)
    cv2.imwrite('record/' + dstr + '.hint.png', hintDataURL)

    rawshape = sketchDataURL.shape;
    sketch = sketchDataURL[:, :, 0:3]
    raw_sketch = sketch.copy()
    sketch = cv2.cvtColor(sketch,cv2.COLOR_RGB2GRAY)
    sketch = cv2.resize(sketch,(448,448),cv2.INTER_AREA)
    sketch = sketch.astype(np.float)
    sketch = sketch / 255.0
    sketch = 1 - sketch
    sketch = sketch[None,:,:,None]

    reference = referenceDataURL[:, :, 0:3]
    reference = cv2.resize(reference, (224, 224), interpolation=cv2.INTER_AREA)
    reference = reference.astype(np.float32)
    reference = reference / 255.0
    reference = reference.transpose((2, 0, 1))[None, :, :, :]

    with chainer.no_backprop_mode(): 
        with chainer.using_config('train', False):
            vhint_s57c64_0, vhint_s29c192_0, vhint_s29c256_0, vhint_s29c320_0, vhint_s15c576_0, vhint_s15c576_1, vhint_s15c576_2, vhint_s15c576_3, vhint_s15c576_4, vhint_s8c1024_0, vhint_s8c1024_1, vhint_s8c1024_2 = google_net.forward(chainer.cuda.to_gpu(reference,chainer_ID))

    hint = hintDataURL[:, :, 0:4]
    color = hint[:,:,0:3]
    color = cv2.cvtColor(color,cv2.COLOR_RGB2HSV).astype(np.float)
    color[:,:,1] *=2
    color = color.clip(0,255).astype(np.uint8)
    color = cv2.cvtColor(color,cv2.COLOR_HSV2RGB)
    hint[:, :, 0:3] = color

    hint = cv2.resize(hint, (448, 448), cv2.INTER_AREA)
    hint = hint.astype(np.float)
    local_hint = hint[:,:,0:3]
    alpha = hint[:, :, 3] / 255.0
    local_hint = local_hint - 127
    local_hint = local_hint / 128.0
    for _ in range(3):
        local_hint[:, :, _] = np.multiply(local_hint[:, :, _], alpha)
    hint = local_hint[None, :, :, :]

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

    final = final[0]

    final += [103.939, 116.779, 123.68]
    final = final[:, :, ::-1]

    final = final.clip(0,255).astype(np.uint8)

    if raw_sketch.shape[0] < raw_sketch.shape[1]:
        s0 = 128
        s1 = int(raw_sketch.shape[1] * (128 / raw_sketch.shape[0]))
        s1 = s1 - s1 % 16
        _s0 = 4 * s0
        _s1 = int(raw_sketch.shape[1] * (_s0 / raw_sketch.shape[0]))
        _s1 = (_s1 + 8) - (_s1 + 8) % 16
    else:
        s1 = 128
        s0 = int(raw_sketch.shape[0] * (128 / raw_sketch.shape[1]))
        s0 = s0 - s0 % 16
        _s1 = 4 * s1
        _s0 = int(raw_sketch.shape[0] * (_s1 / raw_sketch.shape[1]))
        _s0 = (_s0 + 8) - (_s0 + 8) % 16

    sketch = cv2.resize(raw_sketch, (_s1, _s0), interpolation=cv2.INTER_AREA)
    final = cv2.resize(final, (sketch.shape[1], sketch.shape[0]), cv2.INTER_LANCZOS4)
    final = cv2.cvtColor(final, cv2.COLOR_RGB2YUV)
    final = final[None, :, :, :]
    sketch = cv2.cvtColor(sketch, cv2.COLOR_RGB2GRAY)[None, :, :, None]

    fed = np.concatenate([sketch, final], axis=3)
    fed = np.transpose(fed, [0, 3, 1, 2])

    with chainer.no_backprop_mode(): 
        with chainer.using_config('train', False):
            fin = paintschainer.calc(chainer.cuda.to_gpu(fed.astype(np.float32),chainer_ID))

    fin = chainer.cuda.to_cpu(fin.data)[0].clip(0, 255).astype(np.uint8)
    fin = np.transpose(fin, [1, 2, 0])
    fin = cv2.cvtColor(fin, cv2.COLOR_YUV2RGB)

    cv2.imwrite('record/' + dstr + '.fin.png', fin)
    result, buffer = cv2.imencode(".png", fin)
    return base64.b64encode(buffer)


run(host="0.0.0.0", port=8000)