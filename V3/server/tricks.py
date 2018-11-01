import numpy as np
import cv2
from skimage.measure import block_reduce


def from_png_to_jpg(map):
    if map.shape[2] ==3:
        return map
    color = map[:, :, 0:3].astype(np.float) / 255.0
    alpha = map[:, :, 3:4].astype(np.float) / 255.0
    reversed_color = 1 - color
    final_color = (255.0 - reversed_color * alpha * 255.0).clip(0,255).astype(np.uint8)
    return final_color


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
    new_max = max(s1, s0)
    raw_max = max(x.shape[0], x.shape[1])
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


def ini_hint(x):
    r = np.zeros(shape=(x.shape[0], x.shape[1], 4), dtype=np.float32)
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


def opreate_normal_hint(gird, points, type, length):
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
            gird[b_:t_, l_:r_, 2] = r
            gird[b_:t_, l_:r_, 1] = g
            gird[b_:t_, l_:r_, 0] = b
            gird[b_:t_, l_:r_, 3] = 255.0
    return gird


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

