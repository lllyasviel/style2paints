from config import *

if multiple_process:
    from gevent import monkey
    monkey.patch_all()

import re
import os
import cv2
import time
import json
import base64
import shutil
import datetime
import threading
import numpy as np

from bottle import route, run, static_file, request, BaseRequest, response

from ai import *
from tricks import *


BaseRequest.MEMFILE_MAX = 10000 * 1000


def get_request_image(name):
    img = request.forms.get(name)
    img = re.sub('^data:image/.+;base64,', '', img)
    img = base64.urlsafe_b64decode(img)
    img = np.fromstring(img, dtype=np.uint8)
    img = cv2.imdecode(img, -1)
    return img


@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root='game/')


@route('/')
def send_static():
    return static_file("index.html", root='game/')


sketch_upload_pool = []
painting_pool = []


def handle_sketch_upload_pool():
    if len(sketch_upload_pool) > 0:
        room, sketch, method = sketch_upload_pool[0]
        del sketch_upload_pool[0]
        room_path = 'game/rooms/' + room
        print('processing sketch in ' + room_path)
        if os.path.exists(room_path + '/sketch.improved.jpg'):
            improved_sketch = cv2.imread(room_path + '/sketch.improved.jpg')
            print('lucky to find improved sketch')
        else:
            improved_sketch = sketch.copy()
            improved_sketch = min_resize(improved_sketch, 512)
            improved_sketch = cv_denoise(improved_sketch)
            improved_sketch = sensitive(improved_sketch, s=5.0)
            improved_sketch = go_tail(improved_sketch)
            cv2.imwrite(room_path + '/sketch.improved.jpg', improved_sketch)
        color_sketch = improved_sketch.copy()
        std = cal_std(color_sketch)
        print('std = ' + str(std))
        need_de_painting = (std > 100.0) and method == 'rendering'
        if method=='recolorization' or need_de_painting:
            if os.path.exists(room_path + '/sketch.recolorization.jpg') or os.path.exists(room_path + '/sketch.de_painting.jpg'):
                print('lucky to find lined sketch')
            else:
                improved_sketch = go_passline(color_sketch)
                improved_sketch = min_k_down_c(improved_sketch, 2)
                improved_sketch = cv_denoise(improved_sketch)
                improved_sketch = go_tail(improved_sketch)
                improved_sketch = sensitive(improved_sketch, s=5.0)
                cv2.imwrite(room_path + '/sketch.recolorization.jpg', min_black(improved_sketch))
                if need_de_painting:
                    cv2.imwrite(room_path + '/sketch.de_painting.jpg', min_black(improved_sketch))
                    print('In rendering mode, the user has uploaded a painting, and I have translated it into a sketch.')
                print('sketch lined')
        cv2.imwrite(room_path + '/sketch.colorization.jpg', min_black(color_sketch))
        cv2.imwrite(room_path + '/sketch.rendering.jpg', eye_black(color_sketch))
        print('sketch improved')
    return


def handle_painting_pool():
    if len(painting_pool) > 0:
        room, ID, sketch, alpha, reference, points, method, lineColor, line = painting_pool[0]
        del painting_pool[0]
        room_path = 'game/rooms/' + room
        print('processing painting in ' + room_path)
        sketch_1024 = k_resize(sketch, 64)
        if os.path.exists(room_path + '/sketch.de_painting.jpg') and method == 'rendering':
            vice_sketch_1024 = k_resize(cv2.imread(room_path + '/sketch.de_painting.jpg', cv2.IMREAD_GRAYSCALE), 64)
            sketch_256 = mini_norm(k_resize(min_k_down(vice_sketch_1024, 2), 16))
            sketch_128 = hard_norm(sk_resize(min_k_down(vice_sketch_1024, 4), 32))
        else:
            sketch_256 = mini_norm(k_resize(min_k_down(sketch_1024, 2), 16))
            sketch_128 = hard_norm(sk_resize(min_k_down(sketch_1024, 4), 32))
        print('sketch prepared')
        if debugging:
            cv2.imwrite(room_path + '/sketch.128.jpg', sketch_128)
            cv2.imwrite(room_path + '/sketch.256.jpg', sketch_256)
        baby = go_baby(sketch_128, opreate_normal_hint(ini_hint(sketch_128), points, type=0, length=1))
        baby = de_line(baby, sketch_128)
        for _ in range(16):
            baby = blur_line(baby, sketch_128)
        baby = go_tail(baby)
        baby = clip_15(baby)
        if debugging:
            cv2.imwrite(room_path + '/baby.' + ID + '.jpg', baby)
        print('baby born')
        composition = go_gird(sketch=sketch_256, latent=d_resize(baby, sketch_256.shape), hint=ini_hint(sketch_256))
        if line:
            composition = emph_line(composition, d_resize(min_k_down(sketch_1024, 2), composition.shape), lineColor)
        composition = go_tail(composition)
        cv2.imwrite(room_path + '/composition.' + ID + '.jpg', composition)
        print('composition saved')
        painting_function = go_head
        if method == 'rendering':
            painting_function = go_neck
        print('method: ' + method)
        result = painting_function(
            sketch=sketch_1024,
            global_hint=k_resize(composition, 14),
            local_hint=opreate_normal_hint(ini_hint(sketch_1024), points, type=2, length=2),
            global_hint_x=k_resize(reference, 14) if reference is not None else k_resize(composition, 14),
            alpha=(1 - alpha) if reference is not None else 1
        )
        result = go_tail(result)
        cv2.imwrite(room_path + '/result.' + ID + '.jpg', result)
        cv2.imwrite('results/' + room + '.' + ID + '.jpg', result)
        if debugging:
            cv2.imwrite(room_path + '/icon.' + ID + '.jpg', max_resize(result, 128))
    return


@route('/upload_sketch', method='POST')
def upload_sketch():
    room = request.forms.get("room")
    previous_step = request.forms.get("step")
    if previous_step == 'sample':
        new_room_id = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
        shutil.copytree('game/samples/' + room, 'game/rooms/' + new_room_id)
        print('copy ' + 'game/samples/' + room + ' to ' + 'game/rooms/' + new_room_id)
        room = new_room_id
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    method = request.forms.get("method")
    if room == 'new':
        room = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
        room_path = 'game/rooms/' + room
        os.makedirs(room_path, exist_ok=True)
        sketch = from_png_to_jpg(get_request_image('sketch'))
        cv2.imwrite(room_path + '/sketch.original.jpg', sketch)
        print('original_sketch saved')
    else:
        room_path = 'game/rooms/' + room
        sketch = cv2.imread(room_path + '/sketch.original.jpg')
    print('sketch upload pool get request: ' + method)
    sketch_upload_pool.append((room, sketch, method))
    while True:
        time.sleep(0.1)
        if os.path.exists(room_path + '/sketch.' + method + '.jpg'):
            break
    time.sleep(1.0)
    return room + '_' + ID


@route('/request_result', method='POST')
def request_result():
    room = request.forms.get("room")
    previous_step = request.forms.get("step")
    if previous_step == 'sample':
        new_room_id = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
        shutil.copytree('game/samples/' + room, 'game/rooms/' + new_room_id)
        print('copy ' + 'game/samples/' + room + ' to ' + 'game/rooms/' + new_room_id)
        room = new_room_id
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    room_path = 'game/rooms/' + room
    options_str = request.forms.get("options")
    if debugging:
        with open(room_path + '/options.' + ID + '.json', 'w') as f:
            f.write(options_str)
    options = json.loads(options_str)
    method = options["method"]
    sketch = cv2.imread(room_path + '/sketch.' + method + '.jpg', cv2.IMREAD_GRAYSCALE)
    alpha = float(options["alpha"])
    points = options["points"]
    for _ in range(len(points)):
        points[_][1] = 1 - points[_][1]
    if options["hasReference"]:
        reference = from_png_to_jpg(get_request_image('reference'))
        cv2.imwrite(room_path + '/reference.' + ID + '.jpg', reference)
        reference = s_enhance(reference)
    else:
        reference = None
    print('request result room = ' + str(room) + ', ID = ' + str(ID))
    lineColor = np.array(options["lineColor"])
    line = options["line"]
    painting_pool.append([room, ID, sketch, alpha, reference, points, method, lineColor, line])
    while True:
        time.sleep(0.1)
        if os.path.exists(room_path + '/result.' + ID + '.jpg'):
            break
    time.sleep(1.0)
    return room + '_' + ID


@route('/get_sample_list', method='POST')
def get_sample_list():
    all_names = []
    for (root, dirs, files) in os.walk("game/samples"):
        all_names = dirs
        break
    all_names.sort()
    result = json.dumps(all_names)
    return result


@route('/save_as_sample', method='POST')
def save_as_sample():
    room = request.forms.get("room")
    step = request.forms.get("step")
    previous_path = 'game/rooms/' + room
    new_path = 'game/samples/' + room
    os.makedirs(new_path, exist_ok=True)

    def transfer(previous_file_name, new_file_name=None):
        if new_file_name is None:
            new_file_name = previous_file_name
        if os.path.exists(previous_path + '/' + previous_file_name):
            shutil.copy(previous_path + '/' + previous_file_name, new_path + '/' + new_file_name)

    transfer('sketch.original.jpg')
    transfer('sketch.improved.jpg')
    transfer('sketch.colorization.jpg')
    transfer('sketch.rendering.jpg')
    transfer('sketch.recolorization.jpg')
    transfer('sketch.de_painting.jpg')

    transfer('result.' + step + '.jpg', 'result.sample.jpg')
    transfer('reference.' + step + '.jpg', 'reference.sample.jpg')
    transfer('icon.' + step + '.jpg', 'icon.sample.jpg')
    transfer('composition.' + step + '.jpg', 'composition.sample.jpg')
    transfer('options.' + step + '.json', 'options.sample.json')

    print('saved')

    return 'ok'


def server_loop():
    while True:
        time.sleep(0.173)
        try:
            handle_sketch_upload_pool()
            handle_painting_pool()
        except Exception as e:
            print(e)


os.makedirs('game/rooms', exist_ok=True)
os.makedirs('results', exist_ok=True)
threading.Thread(target=server_loop).start()

if multiple_process:
    run(host="0.0.0.0", port=80, server='gevent')
else:
    run(host="0.0.0.0", port=8000)

