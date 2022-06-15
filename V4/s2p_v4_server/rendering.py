import cv2
import numpy as np
from tricks import *
from decompositioner import *


def GuidedFiltF(img, r):
    eps = 0.04
    I = img
    I2 = cv2.pow(I, 2)
    mean_I = cv2.boxFilter(I, -1, ((2 * r) + 1, (2 * r) + 1))
    mean_I2 = cv2.boxFilter(I2, -1, ((2 * r) + 1, (2 * r) + 1))
    cov_I = mean_I2 - cv2.pow(mean_I, 2)
    var_I = cov_I
    a = cv2.divide(cov_I, var_I + eps)
    b = mean_I - (a * mean_I)
    mean_a = cv2.boxFilter(a, -1, ((2 * r) + 1, (2 * r) + 1))
    mean_b = cv2.boxFilter(b, -1, ((2 * r) + 1, (2 * r) + 1))
    q = (mean_a * I) + mean_b
    return q


def ComputeLightDirectionMat(Xpos, Ypos, Zpos, IndexMat3D):
    out = np.copy(IndexMat3D)
    Z = IndexMat3D[:, :, 0] + Zpos
    Y = IndexMat3D[:, :, 1] - Ypos
    X = Xpos - IndexMat3D[:, :, 2]
    SUM = np.sqrt(X ** 2 + Y ** 2 + Z ** 2)
    out[:, :, 0] = Z / SUM
    out[:, :, 1] = Y / SUM
    out[:, :, 2] = X / SUM
    return out


def CreateIndexMat(height, width):
    ind = np.zeros((height, width, 3))
    for j in range(0, height):
        for i in range(0, width):
            ind[j, i, 0] = 0
            ind[j, i, 1] = j
            ind[j, i, 2] = i
    return ind


def ComputeFresnel(dot, ior):
    height, width = dot.shape
    cosi = np.copy(dot)
    etai = np.ones((height, width))
    etat = ior
    sint = etai / etat * np.sqrt(np.maximum(0.0, cosi * cosi))
    sint2 = np.copy(sint)
    cost = np.sqrt(np.maximum(0.0, 1 - sint * sint))
    cosi = abs(cosi)
    sint = (((etat * cosi) - (etai * cost)) / ((etat * cosi) + (etai * cost)) ** 2 + ((etai * cosi) - (etat * cost)) / (
            (etai * cosi) + (etat * cost)) ** 2) / 2.0
    sint[np.where(sint2 >= 1)] = 1
    return 1 - sint


def small_render(imgN, Mask, color, s1024, r, g, b, h, left, top):
    height, width, _ = color.shape
    imgN = imgN.astype(np.float32) / 127.5 - 1.0
    # imgN = GuidedFiltF(imgN, 7)
    Xpos = 0 if left else width
    Ypos = 0 if top else height
    Zpos = h + 1e-5
    amb = 0.55
    ks = 0
    alpha = 10
    ind = CreateIndexMat(height, width)
    Plight = 0.8
    imgN2 = imgN / np.sqrt(np.sum(np.square(imgN), axis=2, keepdims=True))
    LDfg = np.copy(ind)
    Z = ind[:, :, 0] + Zpos
    Y = ind[:, :, 1] - Ypos
    X = Xpos - ind[:, :, 2]
    SUM = np.sqrt(X ** 2 + Y ** 2 + Z ** 2)
    LDfg[:, :, 0] = Z / SUM
    LDfg[:, :, 1] = Y / SUM
    LDfg[:, :, 2] = X / SUM
    LDbg = LDfg.copy()
    if left is False:
        LDbg[:, :, 2] = -LDbg[:, :, 2]
    if top is False:
        LDbg[:, :, 2] = -LDbg[:, :, 2]
    LD = LDbg.copy()
    LD[Mask > 127] = LDfg[Mask > 127]
    dot = np.sum(imgN2 * LD, axis=2)
    dot[np.where(dot < 0)] = 0
    dot[np.where(dot > 1.0)] = 1.0
    dot = dot.astype(np.float32)
    dot3 = np.stack((dot, dot, dot), axis=2)
    # cv2.imwrite('da.png', (dot3 * 255.0).clip(0, 255).astype(np.uint8))
    dot3 = d_resize(re_deatlize(d_resize((dot3 * 255.0).clip(0, 255).astype(np.uint8), s1024.shape), s1024), dot3.shape).astype(np.float32) / 255.0
    # cv2.imwrite('db.png', (dot3 * 255.0).clip(0, 255).astype(np.uint8))
    dot_ori = dot3.copy()
    dot3[dot_ori > 0] = 0
    dot3[dot_ori > 0.3] = 0.8
    dot3[dot_ori > 0.35] = 0.9
    dot3[dot_ori > 0.4] = 1.0
    dot3[np.where(Mask == 0)] = dot_ori[np.where(Mask == 0)]
    dot3 = cv2.GaussianBlur(dot3, (0, 0), 1.0)
    dot3 = cv2.medianBlur(dot3, 5)
    R = (np.multiply(2 * dot3, imgN2) - LD)[:, :, 0]
    R[np.where(R < 0)] = 0
    Rspec = (R ** alpha)
    RspecR = (R ** (50.0 * alpha / 10.0))
    RspecG = (R ** (50.0 * alpha / 10.0))
    RspecB = (R ** (53.47 * alpha / 10.0))
    FresnelR = RspecR + (1 - RspecR) * (1.0 - R) ** 5
    FresnelG = RspecG + (1 - RspecG) * (1.0 - R) ** 5
    FresnelB = RspecB + (1 - RspecB) * (1.0 - R) ** 5
    dstImage = dot3[:, :, 0]
    color64 = color.astype(np.dtype('float64'))
    color64[:, :, 0] = np.minimum(255.0, color64[:, :, 0] * amb * b + Plight * color64[:, :, 0] * dstImage * b + Plight * b * 1.58 * ks * RspecB * FresnelB)
    color64[:, :, 1] = np.minimum(255.0, color64[:, :, 1] * amb * g + Plight * color64[:, :, 1] * dstImage * g + Plight * g * 1.50 * ks * RspecG * FresnelG)
    color64[:, :, 2] = np.minimum(255.0, color64[:, :, 2] * amb * r + Plight * color64[:, :, 2] * dstImage * r + Plight * r * 1.35 * ks * RspecR * FresnelR)
    final = color64.astype(np.dtype('uint8'))
    return final

