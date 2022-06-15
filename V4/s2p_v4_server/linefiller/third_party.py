import cv2
from .thinning import *
from .trappedball_fill import *
from skimage.measure import block_reduce
from skimage.morphology import disk, dilation, erosion
from numba import njit


def np_min_pool(x):
    return block_reduce(x, (2, 2), np.min)


def np_max_pool(x):
    return block_reduce(x, (2, 2), np.max)


def np_max_441(x):
    return block_reduce(x, (4, 4, 1), np.max)


def np_max_pool_221(x):
    return block_reduce(x, (2, 2, 1), np.max)


def np_max_pool_s(x, s):
    return block_reduce(x, (s, s, 1), np.max)


def binarize(x):
    xp = x.copy()
    xp[xp < 250] = 0
    xp[xp > 0] = 255
    return xp


def get_initial_fillmap(boundary, merge=True):
    fillmap = build_fill_map(boundary, flood_fill_multi(boundary, merge=merge))
    return fillmap


def up_propagate(small_fillmap, big_boundary):
    new_fillmap = cv2.resize(small_fillmap, (big_boundary.shape[1], big_boundary.shape[0]), interpolation=cv2.INTER_NEAREST)
    padded_fillmap = np.pad(new_fillmap, [[1, 1], [1, 1]], 'constant', constant_values=0)
    new_mask = np.ones_like(new_fillmap, dtype=np.uint8) * 255
    new_mask[new_fillmap > 0] = 0
    new_mask[big_boundary < 240] = 0
    fills = flood_fill_multi(new_mask, merge=True)
    max_id = np.max(new_fillmap)
    for item in fills:
        points0 = padded_fillmap[(item[0] + 1, item[1] + 0)]
        points1 = padded_fillmap[(item[0] + 1, item[1] + 2)]
        points2 = padded_fillmap[(item[0] + 0, item[1] + 1)]
        points3 = padded_fillmap[(item[0] + 2, item[1] + 1)]

        all_points = np.concatenate([points0, points1, points2, points3], axis=0)
        pointsets, pointcounts = np.unique(all_points[all_points > 0], return_counts=True)

        if len(pointsets) > 0:
            new_fillmap[item] = pointsets[np.argmax(pointcounts)]
        else:
            max_id += 1
            new_fillmap[item] = max_id
    return new_fillmap


def laplas_fill(b_512, b_256, b_128):
    b_512 = binarize(b_512)
    b_256 = binarize(b_256)
    b_128 = binarize(b_128)
    f128 = get_initial_fillmap(b_128)
    f256 = up_propagate(f128, b_256)
    f512 = up_propagate(f256, b_512)
    fin = thinning(f512)
    return fin


@ njit
def get_corner(x):
    corner = x.copy()
    s0 = corner.shape[0]
    s1 = corner.shape[1]
    for i0 in range(1, s0 - 1):
        for i1 in range(1, s1 - 1):
            if x[i0, i1] == 0:
                continue
            if x[i0, i1 - 1] == 0:
                if x[i0 - 1, i1 - 1] == 0:
                    continue
                if x[i0 + 1, i1 - 1] == 0:
                    continue
                corner[i0, i1] = 0
                continue
            if x[i0, i1 + 1] == 0:
                if x[i0 - 1, i1 + 1] == 0:
                    continue
                if x[i0 + 1, i1 + 1] == 0:
                    continue
                corner[i0, i1] = 0
                continue
            if x[i0 - 1, i1] == 0:
                if x[i0 - 1, i1 - 1] == 0:
                    continue
                if x[i0 - 1, i1 + 1] == 0:
                    continue
                corner[i0, i1] = 0
                continue
            if x[i0 + 1, i1] == 0:
                if x[i0 + 1, i1 - 1] == 0:
                    continue
                if x[i0 + 1, i1 + 1] == 0:
                    continue
                corner[i0, i1] = 0
                continue
    return corner


def monogrouh(x):
    y = 255 - x
    y = dilation(y, disk(1))
    y = dilation(y, disk(1))
    y = erosion(y, disk(1))
    y = erosion(y, disk(1))
    y = 255 - y
    return y


def corners(x):
    y = x.copy()
    y = monogrouh(y)
    y = get_corner(y)
    y = monogrouh(y)
    y = get_corner(y)
    y = monogrouh(y)
    return y


def save_fill(name, fill):
    cv2.imwrite(name, show_fill_map(fill))


def double_fill(b_1024, b_512, b256):
    b256 = binarize(b256)
    b_512 = binarize(b_512)
    b_1024 = binarize(b_1024)
    b_1024 = corners(b_1024)
    b_512 = np.min(np.stack([b_512, np_min_pool(b_1024)], axis=2), axis=2)
    b_512 = corners(b_512)
    b_256 = np.min(np.stack([b256, np_min_pool(b_512)], axis=2), axis=2)
    b_256 = corners(b_256)
    b_128 = np_min_pool(b_256)
    b_128 = corners(b_128)
    b_64 = np_min_pool(b_128)
    f64 = get_initial_fillmap(b_64)
    print('get_initial_fillmap(b_64)')
    f128 = up_propagate(f64, b_128)
    print('up_propagate(f64, b_128)')
    f256 = up_propagate(f128, b_256)
    print('up_propagate(f128, b_256)')
    f512 = up_propagate(f256, b_512)
    print('up_propagate(f256, b_512)')
    f1024 = up_propagate(f512, b_1024)
    print('up_propagate(f512, b_1024)')
    fin = thinning(f1024)
    print('thinning(f1024)')

    # cv2.imwrite('b_64.png', b_64)
    # cv2.imwrite('b_128.png', b_128)
    # cv2.imwrite('b_256.png', b_256)
    # cv2.imwrite('b_512.png', b_512)
    # cv2.imwrite('b_1024.png', b_1024)
    # save_fill('f64.png', f64)
    # save_fill('f128.png', f128)
    # save_fill('f256.png', f256)
    # save_fill('f512.png', f512)
    # save_fill('f1024.png', f1024)
    # save_fill('fin.png', fin)

    return find_all(fin)


def single_fill(b_2048, path):
    b_2048 = corners(binarize(b_2048))
    f2048 = get_initial_fillmap(b_2048, merge=False)
    print(path + 'get_initial_fillmap(b_2048, merge=False)')
    fin = thinning(f2048)
    print(path + 'thinning(f2048)')
    # cv2.imwrite(path + 'b_2048.png', b_2048)
    # save_fill(path + 'f2048.png', f2048)
    # save_fill(path + 'fin.png', fin)
    return find_all(fin)


def deatlize(x):
    x = cv2.GaussianBlur(x, (0, 0), 0.8)
    x = cv2.medianBlur(x, 3)
    return x


def low_down(gradient_mask):
    return 1.0 - cv2.dilate(255 - gradient_mask, np.ones((3, 3), np.uint8), iterations=2).astype(np.float32) / 255.0


def cv2pyrDown(x):
    return cv2.pyrDown(cv2.medianBlur(cv2.medianBlur(x, 3), 3))


def cv2pyrUp(x):
    return cv2.pyrUp(cv2.medianBlur(cv2.medianBlur(x, 3), 3))


def re_deatlize(visulized, s1024):

    gradient_mask_1024 = binarize(s1024)
    gradient_mask_512 = np_min_pool(gradient_mask_1024)
    gradient_mask_256 = np_min_pool(gradient_mask_512)
    gradient_mask_128 = np_min_pool(gradient_mask_256)
    gradient_mask_64 = np_min_pool(gradient_mask_128)

    gradient_mask_1024 = low_down(gradient_mask_1024)
    gradient_mask_512 = low_down(gradient_mask_512)
    gradient_mask_256 = low_down(gradient_mask_256)
    gradient_mask_128 = low_down(gradient_mask_128)
    gradient_mask_64 = low_down(gradient_mask_64)

    sample_1024 = visulized.astype(np.float32)
    sample_512 = cv2pyrDown(sample_1024)
    sample_256 = cv2pyrDown(sample_512)
    sample_128 = cv2pyrDown(sample_256)
    sample_64 = cv2pyrDown(sample_128)
    sample_32 = cv2pyrDown(sample_64)

    gradient_1024 = sample_1024 - cv2pyrUp(sample_512)
    gradient_512 = sample_512 - cv2pyrUp(sample_256)
    gradient_256 = sample_256 - cv2pyrUp(sample_128)
    gradient_128 = sample_128 - cv2pyrUp(sample_64)
    gradient_64 = sample_64 - cv2pyrUp(sample_32)

    rec_32 = sample_32
    rec_64 = cv2pyrUp(rec_32) + gradient_64 * (1 - gradient_mask_64[:, :, None])
    rec_128 = cv2pyrUp(rec_64) + gradient_128 * (1 - gradient_mask_128[:, :, None])
    rec_256 = cv2pyrUp(rec_128) + gradient_256 * (1 - gradient_mask_256[:, :, None])
    rec_512 = cv2pyrUp(rec_256) + gradient_512 * (1 - gradient_mask_512[:, :, None])
    rec_1024 = cv2pyrUp(rec_512) + gradient_1024 * (1 - gradient_mask_1024[:, :, None])

    return rec_1024.clip(0, 255).astype(np.uint8)


def tiny_deatlize(visulized, s2048):
    gradient_mask_2048 = s2048.copy()
    gradient_mask_1024 = np_min_pool(gradient_mask_2048)
    gradient_mask_512 = np_min_pool(gradient_mask_1024)
    gradient_mask_256 = np_min_pool(gradient_mask_512)

    gradient_mask_2048 = low_down(gradient_mask_2048)
    gradient_mask_1024 = low_down(gradient_mask_1024)
    gradient_mask_512 = low_down(gradient_mask_512)
    gradient_mask_256 = low_down(gradient_mask_256)

    sample_2048 = visulized.astype(np.float32)
    sample_1024 = cv2.pyrDown(sample_2048)
    sample_512 = cv2.pyrDown(sample_1024)
    sample_256 = cv2.pyrDown(sample_512)
    sample_128 = cv2.pyrDown(sample_256)

    gradient_2048 = sample_2048 - cv2.pyrUp(sample_1024)
    gradient_1024 = sample_1024 - cv2.pyrUp(sample_512)
    gradient_512 = sample_512 - cv2.pyrUp(sample_256)
    gradient_256 = sample_256 - cv2.pyrUp(sample_128)

    rec_128 = sample_128
    rec_256 = cv2.pyrUp(rec_128) + gradient_256 * (1 - gradient_mask_256[:, :, None])
    rec_512 = cv2.pyrUp(rec_256) + gradient_512 * (1 - gradient_mask_512[:, :, None])
    rec_1024 = cv2.pyrUp(rec_512) + gradient_1024 * (1 - gradient_mask_1024[:, :, None])
    rec_2048 = cv2.pyrUp(rec_1024) + gradient_2048 * (1 - gradient_mask_2048[:, :, None])
    return rec_2048.clip(0, 255).astype(np.uint8)


def adain(x, y):
    x_high = cv2.GaussianBlur(x, (0, 0), 3.0)
    y_high = cv2.GaussianBlur(y, (0, 0), 3.0)
    return (x.astype(np.float32) - x_high.astype(np.float32) + y_high.astype(np.float32)).clip(0, 255).astype(np.uint8)


def corrupt(x, b128):
    float_sketch = x.astype(float)
    float_base = cv2.resize(float_sketch, (b128.shape[1], b128.shape[0]), cv2.INTER_AREA)
    alpha = b128[:, :, 0] / 255.0
    float_base = alpha * float_base + (1 - alpha) * np.mean(float_base)
    float_base = cv2.GaussianBlur(float_base, (0, 0), 8.0)
    float_base = cv2.resize(float_base, (x.shape[1], x.shape[0]), cv2.INTER_CUBIC)
    result = float_sketch / (float_base + 1e-10)
    result = result.clip(0, 1)
    result -= np.min(result)
    result /= np.max(result)
    return (result * 255.0).clip(0, 255).astype(np.uint8)


def fuse_sketch(color, sketch, fills, fixer, points_arr, colors_arr):
    sketch = cv2.resize(sketch, (color.shape[1], color.shape[0]))
    fills = cv2.resize(fills, (color.shape[1], color.shape[0]), interpolation=cv2.INTER_NEAREST)
    fill_id = np.unique(fills.flatten())
    bg = np.zeros_like(color, dtype=np.uint8)
    checking_result = np.zeros(dtype=np.int32, shape=(np.max(fills) + 1,)) - 1
    length_points = int(len(points_arr))
    for _ in range(length_points):
        checking_result[fills[points_arr[_][0], points_arr[_][1]]] = _
    for id in fill_id:
        points = np.where(fills == id)
        if len(points[0]) > 0:
            color_id = checking_result[id]
            if color_id > -1:
                bg[points] = np.array(colors_arr[color_id])
            else:
                bg[points] = np.median(color[points], axis=0)
    fixed = adain(fixer(sketch, bg), bg)
    result = (fixed.astype(np.float32) + sketch[:, :, None].astype(np.float32) - 255.0).clip(0, 255).astype(np.uint8)
    return result, fixed, bg


def balance_fill(color, fills, points, sizer):
    color = cv2.resize(color, (sizer.shape[1], sizer.shape[0]), interpolation=cv2.INTER_NEAREST)
    points = cv2.resize(points, (sizer.shape[1], sizer.shape[0]), interpolation=cv2.INTER_NEAREST)
    bg = np.zeros_like(color, dtype=np.uint8)
    for region in fills:
        if len(region[0]) > 0:
            region_points = points[region]
            region_points = region_points[region_points[:, 3] > 0]
            if region_points.shape[0] > 0:
                points_color, points_color_count = np.unique(region_points, return_counts=True, axis=0)
                bg[region] = points_color[np.argmax(points_color_count)][0:3]
            else:
                bg[region] = np.median(color[region], axis=0)
    return bg


def shade_fill(color, fills, points, sizer):
    color = cv2.resize(color, (sizer.shape[1], sizer.shape[0]), interpolation=cv2.INTER_NEAREST)
    points = cv2.resize(points, (sizer.shape[1], sizer.shape[0]), interpolation=cv2.INTER_NEAREST)
    bg = np.zeros_like(color, dtype=np.uint8)
    for region in fills:
        if len(region[0]) > 0:
            region_points = points[region]
            region_points = region_points[region_points[:, 3] > 0]
            if region_points.shape[0] > 0:
                points_color, points_color_count = np.unique(region_points, return_counts=True, axis=0)
                c = points_color[np.argmax(points_color_count)][0:3]
                r = c[0]
                g = c[1]
                b = c[2]
                if r == 1 and g == 233 and b == 0:
                    bg[region] = 255
                elif r == 0 and g == 233 and b == 1:
                    bg[region] = 0
                else:
                    bg[region] = np.median(color[region], axis=0)
            else:
                bg[region] = np.median(color[region], axis=0)
    return bg


def get_alpha_piece(points):
    padded_points = np.pad(points, [[1, 1], [1, 1], [0, 0]], 'constant', constant_values=127)
    lines = 255 - padded_points[:, :, 3]
    lines[lines < 240] = 0
    fills = flood_fill_multi(lines, merge=True)
    result = np.zeros_like(padded_points)
    for item in fills:
        points0 = padded_points[(item[0], item[1] + 1)]
        points1 = padded_points[(item[0], item[1] - 1)]
        points2 = padded_points[(item[0] + 1, item[1])]
        points3 = padded_points[(item[0] - 1, item[1])]
        all_points = np.concatenate([points0, points1, points2, points3], axis=0)
        all_points = all_points[all_points[:, 3] > 0]
        all_points = np.unique(all_points, axis=0)
        if all_points.shape[0] == 1:
            result[item] = all_points[0]
    piece = result[1:-1, 1:-1, :]
    piece = np.maximum(piece, points)
    return piece, points


def fin_deatlize(color, sketch):

    cf = color.astype(np.float32)
    alpha = sketch.astype(np.float32)[:, :, None] / 255.0

    plain = cf * alpha
    lines = cf * (1 - alpha)

    plain = cv2.medianBlur(plain, 5)
    plain = cv2.medianBlur(plain, 3)

    fin = plain + lines

    return fin.clip(0, 255).astype(np.uint8)

