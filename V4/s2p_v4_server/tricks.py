import numpy as np
import cv2
from skimage.measure import block_reduce
from linefiller.trappedball_fill import *
from linefiller.thinning import *
from linefiller.third_party import *


def from_png_to_jpg(map):
    if map.shape[2] ==3:
        return map
    color = map[:, :, 0:3].astype(np.float) / 255.0
    alpha = map[:, :, 3:4].astype(np.float) / 255.0
    reversed_color = 1 - color
    final_color = (255.0 - reversed_color * alpha * 255.0).clip(0,255).astype(np.uint8)
    return final_color


def mk_resize(x, k):
    if x.shape[0] < x.shape[1]:
        s0 = k
        s1 = int(x.shape[1] * (k / x.shape[0]))
        s1 = s1 - s1 % 128
        _s0 = 32 * s0
        _s1 = int(x.shape[1] * (_s0 / x.shape[0]))
        _s1 = (_s1 + 64) - (_s1 + 64) % 128
    else:
        s1 = k
        s0 = int(x.shape[0] * (k / x.shape[1]))
        s0 = s0 - s0 % 128
        _s1 = 32 * s1
        _s0 = int(x.shape[0] * (_s1 / x.shape[1]))
        _s0 = (_s0 + 64) - (_s0 + 64) % 128
    new_min = min(_s1, _s0)
    raw_min = min(x.shape[0], x.shape[1])
    if new_min < raw_min:
        interpolation = cv2.INTER_AREA
    else:
        interpolation = cv2.INTER_LANCZOS4
    y = cv2.resize(x, (_s1, _s0), interpolation=interpolation)
    return y


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


def sk_resize(x, k):
    if x.shape[0] < x.shape[1]:
        s0 = k
        s1 = int(x.shape[1] * (k / x.shape[0]))
        s1 = s1 - s1 % 16
        _s0 = 4 * s0
        _s1 = int(x.shape[1] * (_s0 / x.shape[0]))
        _s1 = (_s1 + 8) - (_s1 + 8) % 16
    else:
        s1 = k
        s0 = int(x.shape[0] * (k / x.shape[1]))
        s0 = s0 - s0 % 16
        _s1 = 4 * s1
        _s0 = int(x.shape[0] * (_s1 / x.shape[1]))
        _s0 = (_s0 + 8) - (_s0 + 8) % 16
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


def n_resize(x, d):
    y = cv2.resize(x, (d[1], d[0]), interpolation=cv2.INTER_NEAREST)
    return y


def s_resize(x, s):
    if x.shape[0] < x.shape[1]:
        s0 = x.shape[0]
        s1 = int(float(s0) / float(s[0]) * float(s[1]))
    else:
        s1 = x.shape[1]
        s0 = int(float(s1) / float(s[1]) * float(s[0]))
    new_max = max(s1, s0)
    raw_max = max(x.shape[0], x.shape[1])
    if new_max < raw_max:
        interpolation = cv2.INTER_AREA
    else:
        interpolation = cv2.INTER_LANCZOS4
    y = cv2.resize(x, (s1, s0), interpolation=interpolation)
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


def max_resize(x, m):
    if x.shape[0] > x.shape[1]:
        s0 = m
        s1 = int(float(m) / float(x.shape[0]) * float(x.shape[1]))
    else:
        s0 = int(float(m) / float(x.shape[1]) * float(x.shape[0]))
        s1 = m
    new_max = max(s1, s0)
    raw_max = max(x.shape[0], x.shape[1])
    if new_max < raw_max:
        interpolation = cv2.INTER_AREA
    else:
        interpolation = cv2.INTER_LANCZOS4
    y = cv2.resize(x, (s1, s0), interpolation=interpolation)
    return y


def s_enhance(x, k=2.0):
    p = cv2.cvtColor(x, cv2.COLOR_RGB2HSV).astype(np.float)
    p[:, :, 1] *= k
    p = p.clip(0, 255).astype(np.uint8)
    return cv2.cvtColor(p, cv2.COLOR_HSV2RGB).clip(0, 255)


def sss_enhance(x, k=2.0):
    p = cv2.cvtColor(x, cv2.COLOR_RGB2HSV).astype(np.float)
    p[:, :, 1] *= k
    p[:, :, 2] = 255
    p = p.clip(0, 255).astype(np.uint8)
    return cv2.cvtColor(p, cv2.COLOR_HSV2RGB).clip(0, 255)


def ini_hint(x):
    r = np.zeros(shape=(x.shape[0], x.shape[1], 4), dtype=np.uint8)
    return r


def opreate_gird_hint(gird, points, type, length):
    h = gird.shape[0]
    w = gird.shape[1]
    for point in points:
        x, y, r, g, b, t = point
        if t == type:
            x = int(x * w)
            y = int(y * h)
            l_ = max(0, x - length)
            b_ = max(0, y - length)
            r_ = min(w, x + length + 1)
            t_ = min(h, y + length + 1)
            gird[b_:t_, l_:r_, 2] = 1 - r / 255.0
            gird[b_:t_, l_:r_, 1] = 1 - g / 255.0
            gird[b_:t_, l_:r_, 0] = 1 - b / 255.0
            gird[b_:t_, l_:r_, 3] = 1
    return gird


def opreate_normal_hint(gird, points, length, skip_sp):
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
        if skip_sp:
            if r == 1 and g == 233 and b == 0:
                continue
            elif r == 0 and g == 233 and b == 1:
                continue
            else:
                gird[b_:t_, l_:r_, 2] = r
                gird[b_:t_, l_:r_, 1] = g
                gird[b_:t_, l_:r_, 0] = b
                gird[b_:t_, l_:r_, 3] = 255.0
        else:
            if r == 1 and g == 233 and b == 0:
                gird[b_:t_, l_:r_, 2] = r
                gird[b_:t_, l_:r_, 1] = g
                gird[b_:t_, l_:r_, 0] = b
                gird[b_:t_, l_:r_, 3] = 255.0
            elif r == 0 and g == 233 and b == 1:
                gird[b_:t_, l_:r_, 2] = r
                gird[b_:t_, l_:r_, 1] = g
                gird[b_:t_, l_:r_, 0] = b
                gird[b_:t_, l_:r_, 3] = 255.0
            else:
                continue
    return gird


def opreate_non_paramic_hints(gird, points, type):
    points_r = []
    colors_r = []
    h = gird.shape[0]
    w = gird.shape[1]
    for point in points:
        x, y, r, g, b, t = point
        if t in type:
            x = int(x * w)
            y = int(y * h)
            points_r.append([y, x])
            colors_r.append([b, g, r])
    return points_r, colors_r


def go_cvline(img):
    x = cv2.Sobel(img, cv2.CV_16S, 1, 0)
    y = cv2.Sobel(img, cv2.CV_16S, 0, 1)
    absX = cv2.convertScaleAbs(x)
    absY = cv2.convertScaleAbs(y)
    r = 255 - cv2.addWeighted(absX, 0.5, absY, 0.5, 0)
    return np.tile(np.min(r, axis=2, keepdims=True).clip(0, 255).astype(np.uint8), [1, 1, 3])


def go_passline(img):
    o = img.astype(np.float32)
    b = cv2.GaussianBlur(img, (7, 7), 0).astype(np.float32)
    r = np.max(b - o, axis=2, keepdims=True)
    r /= np.max(cv2.resize(r.clip(0, 255).astype(np.uint8), (64, 64), cv2.INTER_AREA))
    r = (1 - r).clip(0, 1)
    return np.tile((r * 255.0).clip(0, 255).astype(np.uint8), [1, 1, 3])


def min_k_down(x, k):
    y = 255 - x.astype(np.float32)
    y = block_reduce(y, (k, k), np.max)
    y = 255 - y
    return y.clip(0, 255).astype(np.uint8)


def min_k_down_c(x, k):
    y = 255 - x.astype(np.float32)
    y = block_reduce(y, (k, k, 1), np.max)
    y = 255 - y
    return y.clip(0, 255).astype(np.uint8)


def mini_norm(x):
    y = x.astype(np.float32)
    y = 1 - y / 255.0
    y -= np.min(y)
    y /= np.max(y)
    return (255.0 - y * 80.0).astype(np.uint8)


def hard_norm(x):
    o = x.astype(np.float32)
    b = cv2.GaussianBlur(x, (3, 3), 0).astype(np.float32)
    y = (o - b + 255.0).clip(0, 255)
    y = 1 - y / 255.0
    y -= np.min(y)
    y /= np.max(y)
    y[y < np.mean(y)] = 0
    y[y > 0] = 1
    return (255.0 - y * 255.0).astype(np.uint8)


def sensitive(x, s=15.0):
    y = x.astype(np.float32)
    y -= s
    y /= 255.0 - s * 2.0
    y *= 255.0
    return y.clip(0, 255).astype(np.uint8)


def min_black(x):
    return np.tile(np.min(x, axis=2, keepdims=True), [1, 1, 3])


def eye_black(x):
    return cv2.cvtColor(cv2.cvtColor(x, cv2.COLOR_RGB2GRAY), cv2.COLOR_GRAY2RGB)


def cal_std(x):
    y = (cv2.resize(x, (128, 128), cv2.INTER_AREA)).astype(np.float32)
    return np.mean(np.var(y, axis=2))


def emph_line(x, y, c):
    a = x.astype(np.float32)
    b = y.astype(np.float32)[:, :, None] / 255.0
    c = np.tile(c[None, None, ::-1], [a.shape[0], a.shape[1], 1])
    return (a * b + c * (1 - b)).clip(0, 255).astype(np.uint8)


def de_line(x, y):
    a = x.astype(np.float32)
    b = y.astype(np.float32)[:, :, None] / 255.0
    c = np.tile(np.array([255, 255, 255])[None, None, ::-1], [a.shape[0], a.shape[1], 1])
    return (a * b + c * (1 - b)).clip(0, 255).astype(np.uint8)


def blur_line(x, y):
    o = x.astype(np.float32)
    b = cv2.GaussianBlur(x, (3, 3), 0).astype(np.float32)
    k = y.astype(np.float32)[:, :, None] / 255.0
    return (o * k + b * (1 - k)).clip(0, 255).astype(np.uint8)


def clip_15(x, s=15.0):
    return ((x - s) / (255.0 - s - s)).clip(0, 1) * 255.0


def cv_denoise(x):
    return cv2.fastNlMeansDenoisingColored(x, None, 3, 3, 7, 21)


def norm_sketch(x):
    tiny_image = cv2.resize(x, (256, 256), interpolation=cv2.INTER_AREA)
    min = np.min(tiny_image)
    max = np.max(tiny_image)
    y = x.astype(np.float)
    y -= min
    y /= max - min
    y *= 255.0
    return y.clip(0, 255).astype(np.uint8)


clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(16, 16))


def go_cal(x):
    r = clahe.apply(x[:, :, 0])
    g = clahe.apply(x[:, :, 1])
    b = clahe.apply(x[:, :, 2])
    img = np.stack([r, g, b], axis=2)
    return img


def shrink(x):
    a = cv2.resize(x, (x.shape[1] // 2, x.shape[0] // 2), cv2.INTER_AREA)
    b = a[:, ::-1]
    c = a[::-1, :]
    d = a[::-1, ::-1]
    e = np.concatenate([a, b], axis=1)
    f = np.concatenate([c, d], axis=1)
    g = np.concatenate([e, f], axis=0)
    return g


barriersss = np.zeros(shape=(1024, 1024), dtype=np.uint8)
for _x in range(1024):
    for _y in range(1024):
        if _x % 32 == 0 or _y % 32 == 0 or _x % 32 == 1 or _y % 32 == 1 or _x % 32 == 2 or _y % 32 == 2 or _x % 32 == 3 or _y % 32 == 3 or _x % 32 == 4 or _y % 32 == 4:
            barriersss[_x, _y] = 1


def check_filter(x):
    kbas = cv2.resize(barriersss, (x.shape[1], x.shape[0]), interpolation=cv2.INTER_NEAREST)
    result = np.zeros_like(x)
    result[kbas > 0] = x[kbas > 0]
    return result


def get_hue_direction(source, target):
    h1 = cv2.cvtColor(source, cv2.COLOR_RGB2HSV)[:, :, 0].astype(np.float32)
    h2 = cv2.cvtColor(target, cv2.COLOR_RGB2HSV)[:, :, 0].astype(np.float32)
    h3 = h2 + 256
    h4 = h2 - 256
    r1 = h2 - h1
    r2 = h3 - h1
    r3 = h4 - h1
    rs = r1.copy()
    rs[np.abs(r2) < np.abs(rs)] = r2[np.abs(r2) < np.abs(rs)]
    rs[np.abs(r3) < np.abs(rs)] = r3[np.abs(r3) < np.abs(rs)]
    rs[rs < 0] = 0
    rs[rs > 0] = 255
    return rs.clip(0, 255).astype(np.uint8)


def small_norm(x):
    x = cv2.resize(x, (256, 256), cv2.INTER_AREA)
    x = np_max_pool(x)
    x = np_max_pool(x)
    x = np_max_pool(x)
    x = cv2.GaussianBlur(x, (0, 0), 3.0)
    return x


def cli_norm(sketch):
    tiny_sketch = cv2.resize(sketch, (256, 256), interpolation=cv2.INTER_AREA).astype(np.float32)
    tiny_min = np.min(tiny_sketch)
    tiny_max = np.max(tiny_sketch)
    return ((sketch.astype(np.float32) - tiny_min) / (tiny_max - tiny_min) * 255.0).clip(0, 255).astype(np.uint8)


def image_colorfulness(image):
    R = image[:, :, 0].astype(np.float32)
    G = image[:, :, 1].astype(np.float32)
    B = image[:, :, 2].astype(np.float32)

    R -= np.mean(R)
    G -= np.mean(G)
    B -= np.mean(B)

    rg = np.absolute(R - G)

    yb = np.absolute(0.5 * (R + G) - B)

    (rbMean, rbStd) = (np.mean(rg), np.std(rg))
    (ybMean, ybStd) = (np.mean(yb), np.std(yb))

    stdRoot = np.sqrt((rbStd ** 2) + (ybStd ** 2))
    meanRoot = np.sqrt((rbMean ** 2) + (ybMean ** 2))

    return stdRoot + (0.3 * meanRoot)


def reason_blending(color, sketch):
    color = (color.astype(np.float32) / 255.0).clip(0, 1)
    sketch = (sketch.astype(np.float32) / 255.0).clip(0, 1)
    sketch_r = sketch.copy()
    sketch_r = sketch_r ** 5
    color_max = np.max(color, axis=2, keepdims=True)
    downs = color ** np.pi
    downs = (downs + 1e-10) / (np.max(downs, axis=2, keepdims=True) + 1e-10) * color_max
    bleeding = color * sketch_r + downs * (1 - sketch_r)
    result_YUV = cv2.cvtColor((bleeding * 255.0).clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2YUV)
    sketch_YUV = cv2.cvtColor((sketch * 255.0).clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2YUV)
    result_YUV[:, :, 0] = np.minimum(result_YUV[:, :, 0], sketch_YUV[:, :, 0])
    return cv2.cvtColor(result_YUV, cv2.COLOR_YUV2RGB)


def absmax(a, axis=None):
    amax = a.max(axis)
    amin = a.min(axis)
    return np.where(-amin > amax, amin, amax)


