from keras.layers import Conv2D, Activation, Input, Concatenate, LeakyReLU, Lambda, AveragePooling2D, UpSampling2D, Convolution2D, BatchNormalization, Deconvolution2D, Add
from keras.models import Model
from InstanceNorm import InstanceNormalization


def make_standard_UNET(channels,outs):

    def relu(x):
        return Activation('relu')(x)

    def concat(x):
        return Concatenate()(x)

    c0 = Convolution2D(filters=32, kernel_size=3, strides=1, padding='same', name='c0')
    c1 = Convolution2D(filters=64, kernel_size=4, strides=2, padding='same', name='c1')
    c2 = Convolution2D(filters=64, kernel_size=3, strides=1, padding='same', name='c2')
    c3 = Convolution2D(filters=128, kernel_size=4, strides=2, padding='same', name='c3')
    c4 = Convolution2D(filters=128, kernel_size=3, strides=1, padding='same', name='c4')
    c5 = Convolution2D(filters=256, kernel_size=4, strides=2, padding='same', name='c5')
    c6 = Convolution2D(filters=256, kernel_size=3, strides=1, padding='same', name='c6')
    c7 = Convolution2D(filters=512, kernel_size=4, strides=2, padding='same', name='c7')
    c8 = Convolution2D(filters=512, kernel_size=3, strides=1, padding='same', name='c8')

    bnc0 = BatchNormalization(axis=3, name='bnc0')
    bnc1 = BatchNormalization(axis=3, name='bnc1')
    bnc2 = BatchNormalization(axis=3, name='bnc2')
    bnc3 = BatchNormalization(axis=3, name='bnc3')
    bnc4 = BatchNormalization(axis=3, name='bnc4')
    bnc5 = BatchNormalization(axis=3, name='bnc5')
    bnc6 = BatchNormalization(axis=3, name='bnc6')
    bnc7 = BatchNormalization(axis=3, name='bnc7')
    bnc8 = BatchNormalization(axis=3, name='bnc8')

    dc8 = Deconvolution2D(filters=512, kernel_size=4, strides=2, padding='same', name='dc8_')
    dc7 = Convolution2D(filters=256, kernel_size=3, strides=1, padding='same', name='dc7')
    dc6 = Deconvolution2D(filters=256, kernel_size=4, strides=2, padding='same', name='dc6_')
    dc5 = Convolution2D(filters=128, kernel_size=3, strides=1, padding='same', name='dc5')
    dc4 = Deconvolution2D(filters=128, kernel_size=4, strides=2, padding='same', name='dc4_')
    dc3 = Convolution2D(filters=64, kernel_size=3, strides=1, padding='same', name='dc3')
    dc2 = Deconvolution2D(filters=64, kernel_size=4, strides=2, padding='same', name='dc2_')
    dc1 = Convolution2D(filters=32, kernel_size=3, strides=1, padding='same', name='dc1')
    dc0 = Convolution2D(filters=outs, kernel_size=3, strides=1, padding='same', name='dc0')

    bnd1 = BatchNormalization(axis=3, name='bnd1')
    bnd2 = BatchNormalization(axis=3, name='bnd2')
    bnd3 = BatchNormalization(axis=3, name='bnd3')
    bnd4 = BatchNormalization(axis=3, name='bnd4')
    bnd5 = BatchNormalization(axis=3, name='bnd5')
    bnd6 = BatchNormalization(axis=3, name='bnd6')
    bnd7 = BatchNormalization(axis=3, name='bnd7')
    bnd8 = BatchNormalization(axis=3, name='bnd8')

    x = Input(shape=(128, 128, channels))

    e0 = relu(bnc0(c0(x), training = False))
    e1 = relu(bnc1(c1(e0), training = False))
    e2 = relu(bnc2(c2(e1), training = False))
    e3 = relu(bnc3(c3(e2), training = False))
    e4 = relu(bnc4(c4(e3), training = False))
    e5 = relu(bnc5(c5(e4), training = False))
    e6 = relu(bnc6(c6(e5), training = False))
    e7 = relu(bnc7(c7(e6), training = False))
    e8 = relu(bnc8(c8(e7), training = False))

    d8 = relu(bnd8(dc8(concat([e7, e8])), training = False))
    d7 = relu(bnd7(dc7(d8), training = False))
    d6 = relu(bnd6(dc6(concat([e6, d7])), training = False))
    d5 = relu(bnd5(dc5(d6), training = False))
    d4 = relu(bnd4(dc4(concat([e4, d5])), training = False))
    d3 = relu(bnd3(dc3(d4), training = False))
    d2 = relu(bnd2(dc2(concat([e2, d3])), training = False))
    d1 = relu(bnd1(dc1(d2), training = False))
    d0 = dc0(concat([e0, d1]))

    model = Model(inputs=x,outputs=d0)

    return model


def make_diff_net():

    def conv(x, filters, name):
        return Conv2D(filters=filters, strides=(1, 1), kernel_size=(3, 3), padding='same', name=name)(x)

    def relu(x):
        return Activation('relu')(x)

    def lrelu(x):
        return LeakyReLU(alpha=0.1)(x)

    def r_block(x, filters, name=None):
        return relu(conv(relu(conv(x, filters, None if name is None else name + '_c1')), filters,
                         None if name is None else name + '_c2'))

    def cat(a, b):
        return Concatenate()([UpSampling2D((2, 2))(a), b])

    def dog(x):
        down = AveragePooling2D((2, 2))(x)
        up = UpSampling2D((2, 2))(down)
        diff = Lambda(lambda p: p[0] - p[1])([x, up])
        return down, diff

    ip = Input(shape=(512, 512, 3))

    c512 = r_block(ip, 16, 'c512')

    c256, l512 = dog(c512)
    c256 = r_block(c256, 32, 'c256')

    c128, l256 = dog(c256)
    c128 = r_block(c128, 64, 'c128')

    c64, l128 = dog(c128)
    c64 = r_block(c64, 128, 'c64')

    c32, l64 = dog(c64)
    c32 = r_block(c32, 256, 'c32')

    c16, l32 = dog(c32)
    c16 = r_block(c16, 512, 'c16')

    d32 = cat(c16, l32)
    d32 = r_block(d32, 256, 'd32')

    d64 = cat(d32, l64)
    d64 = r_block(d64, 128, 'd64')

    d128 = cat(d64, l128)
    d128 = r_block(d128, 64, 'd128')

    d256 = cat(d128, l256)
    d256 = r_block(d256, 32, 'd256')

    d512 = cat(d256, l512)
    d512 = r_block(d512, 16, 'd512')

    op = conv(d512, 1, 'op')

    return Model(inputs=ip, outputs=op)


def make_wnet256():

    def conv(x, filters):
        return Conv2D(filters=filters, strides=(1, 1), kernel_size=(3, 3), padding='same')(x)

    def relu(x):
        return Activation('relu')(x)

    def lrelu(x):
        return LeakyReLU(alpha=0.1)(x)

    def r_block(x, filters):
        return relu(conv(relu(conv(x, filters)), filters))

    def res_block(x, filters):
        return relu(Add()([x, conv(relu(conv(x, filters)), filters)]))

    def cat(a, b):
        return Concatenate()([UpSampling2D((2, 2))(a), b])

    def dog(x):
        down = AveragePooling2D((2, 2))(x)
        up = UpSampling2D((2, 2))(down)
        diff = Lambda(lambda p: p[0] - p[1])([x, up])
        return down, diff

    ip_sketch = Input(shape=(256, 256, 1))
    ip_color = Input(shape=(256, 256, 3))

    c256 = r_block(ip_sketch, 32)

    c128, l256 = dog(c256)
    c128 = r_block(c128, 64)

    c64, l128 = dog(c128)
    c64 = r_block(c64, 128)

    c32, l64 = dog(c64)
    c32 = r_block(Concatenate()([c32, AveragePooling2D((8, 8))(ip_color)]), 256)

    c32 = res_block(c32, 256)
    c32 = res_block(c32, 256)
    c32 = res_block(c32, 256)

    c32 = res_block(c32, 256)
    c32 = res_block(c32, 256)
    c32 = res_block(c32, 256)

    c32 = res_block(c32, 256)
    c32 = res_block(c32, 256)
    c32 = res_block(c32, 256)

    d64 = cat(c32, l64)
    d64 = r_block(d64, 128)

    d128 = cat(d64, l128)
    d128 = r_block(d128, 64)

    d256 = cat(d128, l256)
    d256 = r_block(d256, 32)

    op = conv(d256, 3)

    return Model(inputs=[ip_sketch, ip_color], outputs=op)


def make_unet512():

    def conv(x, filters, strides=(1, 1), kernel_size=(3, 3)):
        return Conv2D(filters=filters, strides=strides, kernel_size=kernel_size, padding='same')(x)

    def donv(x, filters, strides=(2, 2), kernel_size=(4, 4)):
        return Deconvolution2D(filters=filters, strides=strides, kernel_size=kernel_size, padding='same')(x)

    def relu(x):
        return Activation('relu')(x)

    def sigmoid(x):
        return Activation('sigmoid')(x)

    def norm(x):
        return InstanceNormalization(axis=3)(x)

    def cat(a, b):
        return Concatenate()([a, b])

    def res(x, filters):
        c1 = relu(norm(conv(x, filters // 2)))
        c2 = norm(conv(c1, filters))
        ad = Add()([x, c2])
        return relu(ad)

    ip = Input(shape=(512, 512, 3))

    c512 = relu(norm(conv(ip, 16, strides=(1, 1), kernel_size=(3, 3))))
    c256 = relu(norm(conv(c512, 32, strides=(2, 2), kernel_size=(4, 4))))

    c128 = relu(norm(conv(c256, 64, strides=(2, 2), kernel_size=(4, 4))))
    c128 = res(c128, 64)

    c64 = relu(norm(conv(c128, 128, strides=(2, 2), kernel_size=(4, 4))))
    c64 = res(c64, 128)
    c64 = res(c64, 128)

    c32 = relu(norm(conv(c64, 256, strides=(2, 2), kernel_size=(4, 4))))
    c32 = res(c32, 256)
    c32 = res(c32, 256)
    c32 = res(c32, 256)
    c32 = res(c32, 256)
    c32 = res(c32, 256)
    c32 = res(c32, 256)
    c32 = res(c32, 256)
    c32 = res(c32, 256)

    c16 = relu(norm(conv(c32, 512, strides=(2, 2), kernel_size=(4, 4))))
    c16 = res(c16, 512)
    c16 = res(c16, 512)
    c16 = res(c16, 512)
    c16 = res(c16, 512)
    c16 = res(c16, 512)
    c16 = res(c16, 512)
    c16 = res(c16, 512)
    c16 = res(c16, 512)

    c8 = relu(norm(conv(c16, 1024, strides=(2, 2), kernel_size=(4, 4))))
    c8 = res(c8, 1024)
    c8 = res(c8, 1024)
    c8 = res(c8, 1024)
    c8 = res(c8, 1024)

    e16 = relu(norm(donv(c8, 512, strides=(2, 2), kernel_size=(4, 4))))
    e16 = cat(e16, c16)
    e16 = relu(norm(conv(e16, 512, strides=(1, 1), kernel_size=(3, 3))))

    e32 = relu(norm(donv(e16, 256, strides=(2, 2), kernel_size=(4, 4))))
    e32 = cat(e32, c32)
    e32 = relu(norm(conv(e32, 256, strides=(1, 1), kernel_size=(3, 3))))

    e64 = relu(norm(donv(e32, 128, strides=(2, 2), kernel_size=(4, 4))))
    e64 = cat(e64, c64)
    e64 = relu(norm(conv(e64, 128, strides=(1, 1), kernel_size=(3, 3))))

    e128 = relu(norm(donv(e64, 64, strides=(2, 2), kernel_size=(4, 4))))
    e128 = cat(e128, c128)
    e128 = relu(norm(conv(e128, 64, strides=(1, 1), kernel_size=(3, 3))))

    e256 = relu(norm(donv(e128, 32, strides=(2, 2), kernel_size=(4, 4))))
    e256 = cat(e256, c256)
    e256 = relu(norm(conv(e256, 32, strides=(1, 1), kernel_size=(3, 3))))

    e512 = relu(norm(donv(e256, 16, strides=(2, 2), kernel_size=(4, 4))))
    e512 = cat(e512, c512)
    e512 = relu(norm(conv(e512, 16, strides=(1, 1), kernel_size=(3, 3))))

    ot = sigmoid(conv(e512, 1))

    return Model(inputs=ip, outputs=ot)
