import cv2
import numpy as np
from scipy.ndimage import label
from numba import njit


def get_ball_structuring_element(radius):
    """Get a ball shape structuring element with specific radius for morphology operation.
    The radius of ball usually equals to (leaking_gap_size / 2).
    
    # Arguments
        radius: radius of ball shape.
             
    # Returns
        an array of ball structuring element.
    """
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * radius + 1, 2 * radius + 1))


def get_unfilled_point(image):
    """Get points belong to unfilled(value==255) area.

    # Arguments
        image: an image.

    # Returns
        an array of points.
    """
    y, x = np.where(image == 255)

    return np.stack((x.astype(int), y.astype(int)), axis=-1)


def exclude_area(image, radius):
    """Perform erosion on image to exclude points near the boundary.
    We want to pick part using floodfill from the seed point after dilation. 
    When the seed point is near boundary, it might not stay in the fill, and would
    not be a valid point for next floodfill operation. So we ignore these points with erosion.

    # Arguments
        image: an image.
        radius: radius of ball shape.

    # Returns
        an image after dilation.
    """
    return cv2.morphologyEx(image, cv2.MORPH_ERODE, get_ball_structuring_element(radius), anchor=(-1, -1), iterations=1)


def trapped_ball_fill_single(image, seed_point, radius):
    """Perform a single trapped ball fill operation.

    # Arguments
        image: an image. the image should consist of white background, black lines and black fills.
               the white area is unfilled area, and the black area is filled area.
        seed_point: seed point for trapped-ball fill, a tuple (integer, integer).
        radius: radius of ball shape.
    # Returns
        an image after filling.
    """
    ball = get_ball_structuring_element(radius)

    pass1 = np.full(image.shape, 255, np.uint8)
    pass2 = np.full(image.shape, 255, np.uint8)

    im_inv = cv2.bitwise_not(image)

    # Floodfill the image
    mask1 = cv2.copyMakeBorder(im_inv, 1, 1, 1, 1, cv2.BORDER_CONSTANT, 0)
    _, pass1, _, _ = cv2.floodFill(pass1, mask1, seed_point, 0, 0, 0, 4)

    # Perform dilation on image. The fill areas between gaps became disconnected.
    pass1 = cv2.morphologyEx(pass1, cv2.MORPH_DILATE, ball, anchor=(-1, -1), iterations=1)
    mask2 = cv2.copyMakeBorder(pass1, 1, 1, 1, 1, cv2.BORDER_CONSTANT, 0)

    # Floodfill with seed point again to select one fill area.
    _, pass2, _, rect = cv2.floodFill(pass2, mask2, seed_point, 0, 0, 0, 4)
    # Perform erosion on the fill result leaking-proof fill.
    pass2 = cv2.morphologyEx(pass2, cv2.MORPH_ERODE, ball, anchor=(-1, -1), iterations=1)

    return pass2


def trapped_ball_fill_multi(image, radius, method='mean', max_iter=1000):
    """Perform multi trapped ball fill operations until all valid areas are filled.

    # Arguments
        image: an image. The image should consist of white background, black lines and black fills.
               the white area is unfilled area, and the black area is filled area.
        radius: radius of ball shape.
        method: method for filtering the fills. 
               'max' is usually with large radius for select large area such as background.
        max_iter: max iteration number.
    # Returns
        an array of fills' points.
    """
    print('trapped-ball ' + str(radius))

    unfill_area = image
    filled_area, filled_area_size, result = [], [], []

    for _ in range(max_iter):
        points = get_unfilled_point(exclude_area(unfill_area, radius))

        if not len(points) > 0:
            break

        fill = trapped_ball_fill_single(unfill_area, (points[0][0], points[0][1]), radius)
        unfill_area = cv2.bitwise_and(unfill_area, fill)

        filled_area.append(np.where(fill == 0))
        filled_area_size.append(len(np.where(fill == 0)[0]))

    filled_area_size = np.asarray(filled_area_size)

    if method == 'max':
        area_size_filter = np.max(filled_area_size)
    elif method == 'median':
        area_size_filter = np.median(filled_area_size)
    elif method == 'mean':
        area_size_filter = np.mean(filled_area_size)
    else:
        area_size_filter = 0

    result_idx = np.where(filled_area_size >= area_size_filter)[0]

    for i in result_idx:
        result.append(filled_area[i])

    return result


def flood_fill_single(im, seed_point):
    """Perform a single flood fill operation.

    # Arguments
        image: an image. the image should consist of white background, black lines and black fills.
               the white area is unfilled area, and the black area is filled area.
        seed_point: seed point for trapped-ball fill, a tuple (integer, integer).
    # Returns
        an image after filling.
    """
    pass1 = np.full(im.shape, 255, np.uint8)

    im_inv = cv2.bitwise_not(im)

    mask1 = cv2.copyMakeBorder(im_inv, 1, 1, 1, 1, cv2.BORDER_CONSTANT, 0)
    _, pass1, _, _ = cv2.floodFill(pass1, mask1, seed_point, 0, 0, 0, 4)

    return pass1


@njit
def count_all(labeled_array, all_counts):
    M = labeled_array.shape[0]
    N = labeled_array.shape[1]
    for x in range(M):
        for y in range(N):
            i = labeled_array[x, y] - 1
            if i > -1:
                all_counts[i] = all_counts[i] + 1
    return


@njit
def trace_all(labeled_array, xs, ys, cs):
    M = labeled_array.shape[0]
    N = labeled_array.shape[1]
    for x in range(M):
        for y in range(N):
            current_label = labeled_array[x, y] - 1
            if current_label > -1:
                current_label_count = cs[current_label]
                xs[current_label][current_label_count] = x
                ys[current_label][current_label_count] = y
                cs[current_label] = current_label_count + 1
    return


def find_all(labeled_array):
    hist_size = int(np.max(labeled_array))
    if hist_size == 0:
        return []
    all_counts = [0 for _ in range(hist_size)]
    count_all(labeled_array, all_counts)
    xs = [np.zeros(shape=(item, ), dtype=np.uint32) for item in all_counts]
    ys = [np.zeros(shape=(item, ), dtype=np.uint32) for item in all_counts]
    cs = [0 for item in all_counts]
    trace_all(labeled_array, xs, ys, cs)
    filled_area = []
    for _ in range(hist_size):
        filled_area.append((xs[_], ys[_]))
    return filled_area


def flood_fill_multi(image, merge=False):
    print('floodfill')

    labeled_array, num_features = label(image / 255)
    print('floodfill_ok1')

    filled_area = find_all(labeled_array)

    print('floodfill_ok2')

    if merge:
        new_fill = []
        for item in filled_area:
            if len(item[0]) > 8:
                new_fill.append(item)
        return new_fill

    print('floodfill_ok3')

    return filled_area


def old_flood_fill_multi(image, max_iter=20000):
    """Perform multi flood fill operations until all valid areas are filled.
    This operation will fill all rest areas, which may result large amount of fills.

    # Arguments
        image: an image. the image should contain white background, black lines and black fills.
               the white area is unfilled area, and the black area is filled area.
        max_iter: max iteration number.
    # Returns
        an array of fills' points.
    """
    print('floodfill')

    unfill_area = image
    filled_area = []

    for _ in range(max_iter):
        points = get_unfilled_point(unfill_area)

        if not len(points) > 0:
            break

        fill = flood_fill_single(unfill_area, (points[0][0], points[0][1]))
        unfill_area = cv2.bitwise_and(unfill_area, fill)

        filled_area.append(np.where(fill == 0))

    return filled_area


def mark_fill(image, fills):
    """Mark filled areas with 0.

    # Arguments
        image: an image.
        fills: an array of fills' points.
    # Returns
        an image.
    """
    result = image.copy()

    for fill in fills:
        result[fill] = 0

    return result


def build_fill_map(image, fills):
    """Make an image(array) with each pixel(element) marked with fills' id. id of line is 0.

    # Arguments
        image: an image.
        fills: an array of fills' points.
    # Returns
        an array.
    """
    result = np.zeros(image.shape[:2], np.int)

    for index, fill in enumerate(fills):

        if(len(fill[0]) == 0):
            continue

        result[fill] = index + 1

    return result


def show_fill_map(fillmap):
    """Mark filled areas with colors. It is useful for visualization.

    # Arguments
        image: an image.
        fills: an array of fills' points.
    # Returns
        an image.
    """
    # Generate color for each fill randomly.
    colors = np.random.randint(0, 255, (np.max(fillmap) + 1, 3))
    # Id of line is 0, and its color is black.
    colors[0] = [0, 0, 0]

    return colors[fillmap]


def get_bounding_rect(points):
    """Get a bounding rect of points.

    # Arguments
        points: array of points.
    # Returns
        rect coord
    """
    x1, y1, x2, y2 = np.min(points[1]), np.min(points[0]), np.max(points[1]), np.max(points[0])
    return x1, y1, x2, y2


def get_border_bounding_rect(h, w, p1, p2, r):
    """Get a valid bounding rect in the image with border of specific size.

    # Arguments
        h: image max height.
        w: image max width.
        p1: start point of rect.
        p2: end point of rect.
        r: border radius.
    # Returns
        rect coord
    """
    x1, y1, x2, y2 = p1[0], p1[1], p2[0], p2[1]

    x1 = x1 - r if 0 < x1 - r else 0
    y1 = y1 - r if 0 < y1 - r else 0
    x2 = x2 + r + 1 if x2 + r + 1 < w else w
    y2 = y2 + r + 1 if y2 + r + 1 < h else h

    return x1, y1, x2, y2


def get_border_point(points, rect, max_height, max_width):
    """Get border points of a fill area

    # Arguments
        points: points of fill .
        rect: bounding rect of fill.
        max_height: image max height.
        max_width: image max width.
    # Returns
        points , convex shape of points
    """
    # Get a local bounding rect.
    border_rect = get_border_bounding_rect(max_height, max_width, rect[:2], rect[2:], 2)

    # Get fill in rect.
    fill = np.zeros((border_rect[3] - border_rect[1], border_rect[2] - border_rect[0]), np.uint8)
    # Move points to the rect.
    fill[(points[0] - border_rect[1], points[1] - border_rect[0])] = 255

    # Get shape.
    _, contours, _ = cv2.findContours(fill, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # approx_shape = cv2.approxPolyDP(contours[0], 0.02 * cv2.arcLength(contours[0], True), True)

    # Get border pixel.
    # Structuring element in cross shape is used instead of box to get 4-connected border.
    cross = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    border_pixel_mask = cv2.morphologyEx(fill, cv2.MORPH_DILATE, cross, anchor=(-1, -1), iterations=1) - fill
    border_pixel_points = np.where(border_pixel_mask == 255)

    # Transform points back to fillmap.
    border_pixel_points = (border_pixel_points[0] + border_rect[1], border_pixel_points[1] + border_rect[0])

    return border_pixel_points


def merge_fill(fillmap, max_iter=20):
    """Merge fill areas.

    # Arguments
        fillmap: an image.
        max_iter: max iteration number.
    # Returns
        an image.
    """
    max_height, max_width = fillmap.shape[:2]
    result = fillmap.copy()

    for i in range(max_iter):
        print('merge ' + str(i + 1))

        result[np.where(fillmap == 0)] = 0

        fill_id = np.unique(result.flatten())
        fills = []

        for j in fill_id:
            point = np.where(result == j)

            fills.append({
                'id': j,
                'point': point,
                'area': len(point[0]),
            })

        for j, f in enumerate(fills):
            # ignore lines
            if f['id'] == 0:
                continue

            if f['area'] < 5:
                result[f['point']] = 0

        if len(fill_id) == len(np.unique(result.flatten())):
            break

    return result


def merge_one(fillmap):
    result = fillmap.copy()
    print('merge')
    result[np.where(fillmap == 0)] = 0
    fill_id = np.unique(result.flatten())
    fills = []
    for j in fill_id:
        point = np.where(result == j)
        fills.append({
            'id': j,
            'point': point,
            'area': len(point[0]),
        })
    for j, f in enumerate(fills):
        # ignore lines
        if f['id'] == 0:
            continue

        if f['area'] < 5:
            result[f['point']] = 0
    return result

