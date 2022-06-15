import numpy as np
import cv2
from numba import njit


@njit
def njit_thin(points, maps):
    result = maps.copy()
    h, w = maps.shape[:2]
    for _ in range(len(points[0])):
        x = points[0][_]
        y = points[1][_]
        if x > 0:
            a = maps[x-1, y]
            if a > 0:
                result[x, y] = a
                continue
        if y > 0:
            a = maps[x, y-1]
            if a > 0:
                result[x, y] = a
                continue
        if x + 1 < h:
            a = maps[x+1, y]
            if a > 0:
                result[x, y] = a
                continue
        if y + 1 < w:
            a = maps[x, y+1]
            if a > 0:
                result[x, y] = a
                continue
    return result


def thinning(fillmap, max_iter=100):
    result = fillmap.copy()
    for iterNum in range(max_iter):
        line_points = np.where(result == 0)
        if not len(line_points[0]) > 0:
            break
        result = njit_thin(line_points, result)
    return result

