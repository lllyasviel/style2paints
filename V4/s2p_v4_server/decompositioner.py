import os
import numpy as np
from scipy.spatial import ConvexHull
from sklearn.cluster import MiniBatchKMeans
from tricks import *
import cv2


ksd = 8
mbc = MiniBatchKMeans(ksd)


def get_theme(img):
    images = np.reshape(cv2.resize(img, (256, 256)), (256 * 256, 3))
    hull = ConvexHull(images)
    return hull.points[hull.vertices]


def simplify_points(points, img):
    labels = mbc.fit(points)
    new_points = []
    all_center = np.mean(labels.cluster_centers_, axis=0)
    distances = np.sum((points - all_center) ** 2, axis=1) ** 0.5

    for idx in range(ksd):
        candidates = points[labels.labels_ == idx]
        scores = distances[labels.labels_ == idx]
        best_id = np.argmax(scores)
        new_points.append(candidates[best_id])

    new_points.sort(key=np.sum, reverse=True)

    new_points = np.stack(new_points, axis=0)
    return new_points.clip(0, 255).astype(np.uint8)


def get_ini_layers(miku, points):
    results = []
    final_target = miku.astype(np.float32)
    bg = np.zeros_like(final_target, dtype=np.float32) + points[0]
    results.append(np.concatenate([bg, np.zeros_like(bg, dtype=np.float32) + 255], axis=2)[:, :, 0:4])
    current_result = bg.copy()
    for layer_index in range(1, ksd):
        current_base = current_result.astype(np.float32)
        current_color = np.zeros_like(final_target, dtype=np.float32) + points[layer_index]
        overall_direction = final_target - current_base
        avaliable_direction = current_color - current_base
        current_alpha = np.sum(overall_direction * avaliable_direction, axis=2, keepdims=True) / np.sum(
            avaliable_direction * avaliable_direction, axis=2, keepdims=True)
        current_alpha = current_alpha.clip(0, 1)
        current_result = (current_color * current_alpha + current_base * (1 - current_alpha)).clip(0, 255)
        results.append(np.concatenate([current_color, current_alpha * 255.0], axis=2))
    return results


def make_reconstruction(layers):
    bg = np.zeros_like(layers[0], dtype=np.float32)[:, :, 0:3] + 255
    for item in layers:
        current_alpha = item[:, :, 3:4] / 255.0
        bg = item[:, :, 0:3] * current_alpha + bg * (1 - current_alpha)
    return bg


def improve_layers(layers, miku):
    reconstruction = make_reconstruction(layers)
    b = miku - reconstruction
    new_layers = []
    for item in layers:
        new_item = item.copy()
        new_item[:, :, 0:3] = (new_item[:, :, 0:3] + b).clip(0, 255)
        new_layers.append(new_item)
    return new_layers


def cluster_all(labeled_array, num_features):
    xs = [[] for _ in range(num_features)]
    ys = [[] for _ in range(num_features)]
    M = labeled_array.shape[0]
    N = labeled_array.shape[1]
    for x in range(M):
        for y in range(N):
            i = labeled_array[x, y]
            xs[i].append(x)
            ys[i].append(y)
    result = []
    for _ in range(num_features):
        result.append((np.array(xs[_]), np.array(ys[_])))
    return result


def meder(x):
    y = x.copy()
    y = cv2.medianBlur(y, 5)
    y = cv2.medianBlur(y, 5)
    y = cv2.medianBlur(y, 3)
    y = cv2.medianBlur(y, 3)
    return y


def re_med(s_2048):

    sample_2048 = s_2048.astype(np.float32)
    sample_1024 = cv2.pyrDown(sample_2048)
    sample_512 = cv2.pyrDown(sample_1024)
    sample_256 = cv2.pyrDown(sample_512)

    gradient_2048 = sample_2048 - cv2.pyrUp(sample_1024)
    gradient_1024 = sample_1024 - cv2.pyrUp(sample_512)
    gradient_512 = sample_512 - cv2.pyrUp(sample_256)

    rec_256 = meder(sample_256)
    rec_512 = cv2.pyrUp(rec_256) + meder(gradient_512)
    rec_1024 = cv2.pyrUp(rec_512) + meder(gradient_1024)
    rec_2048 = cv2.pyrUp(rec_1024) + meder(gradient_2048)
    return rec_2048


def process_ctx(sketch, solid, render):
    solid = solid.astype(np.float32)
    sketch = d_resize(cv2.cvtColor(sketch, cv2.COLOR_GRAY2RGB), solid.shape).astype(np.float32)
    render = d_resize(render, solid.shape).astype(np.float32)
    alpha = sketch / 255.0
    all_diff = render - solid
    all_lines = render.copy()
    all_lines = cv2.erode(all_lines, np.ones((3,3), np.uint8)) * 0.618
    all_diff = re_med(all_diff)
    all_lines = re_med(all_lines)
    recon = solid + all_diff
    recon = recon * alpha + all_lines * (1 - alpha)
    recon2 = (solid + all_diff) * alpha + re_med(solid) * (1 - alpha)
    recon3 = reason_blending(recon2, sketch)
    return recon.clip(0, 255).astype(np.uint8), recon2.clip(0, 255).astype(np.uint8), recon3.clip(0, 255).astype(np.uint8)


def process_psd(sketch, solid, render, path='./'):
    recon = process_ctx(sketch, solid, render)
    points = get_theme(solid)
    points = simplify_points(points, solid)
    compositions = get_ini_layers(solid, points)
    compositions = improve_layers(compositions, solid)
    for _ in range(ksd):
        cv2.imwrite(path + str(_ + 1) + '.color.png', compositions[_].clip(0, 255).astype(np.uint8))
    solid = make_reconstruction(compositions).clip(0, 255).astype(np.uint8)
    os.makedirs(path, exist_ok=True)
    alpha = 1 - sketch.astype(np.float32) / 255.0
    now = solid
    now = (now.astype(np.float32) + sketch.astype(np.float32) - 255.0).clip(0, 255)
    sketch = 255 + now - solid
    cv2.imwrite(path + '9.sketch.png', sketch.clip(0, 255).astype(np.uint8))
    all_diff = recon.astype(np.float32) - now
    all_light = all_diff.copy()
    all_shadow = - all_diff.copy()
    all_light[all_light < 0] = 0
    all_shadow[all_shadow < 0] = 0
    sketch_color = all_light * alpha
    light = all_light * (1 - alpha)
    all_shadow = 255 - all_shadow
    cv2.imwrite(path + '10.sketch_color.png', sketch_color.clip(0, 255).astype(np.uint8))
    cv2.imwrite(path + '11.light.png', light.clip(0, 255).astype(np.uint8))
    cv2.imwrite(path + '12.shadow.png', all_shadow.clip(0, 255).astype(np.uint8))
    return recon


def process_albedo(albedo, composition, sketch):
    DEL = albedo.astype(np.float32)
    HSV = cv2.cvtColor(albedo, cv2.COLOR_RGB2HSV).astype(np.float32)
    YUV = cv2.cvtColor(albedo, cv2.COLOR_RGB2YUV).astype(np.float32)
    solid = composition.astype(np.float32)
    light = sketch[:, :, None].astype(np.float32)

    DEL = DEL * light / 255.0 + solid * (1 - light / 255.0)
    HSV[:, :, 2:3] = np.minimum(HSV[:, :, 2:3], light)
    YUV[:, :, 0:1] = np.minimum(YUV[:, :, 0:1], light)

    DEL = DEL.clip(0, 255).astype(np.uint8)
    HSV = HSV.clip(0, 255).astype(np.uint8)
    YUV = YUV.clip(0, 255).astype(np.uint8)

    return cv2.cvtColor(HSV, cv2.COLOR_HSV2RGB), cv2.cvtColor(YUV, cv2.COLOR_YUV2RGB), DEL


def process_overlay(composition, sketch):
    RGB = composition.astype(np.float32)
    alpha = sketch[:, :, None].astype(np.float32) / 255.0
    return (RGB * alpha).clip(0, 255).astype(np.uint8)
