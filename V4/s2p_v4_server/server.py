import re
import base64
import datetime
import sys
import pickle
import gzip
import json
import time

from bottle import route, run, static_file, request, BaseRequest, HTTPError

from ai import *
from tricks import *
from decompositioner import *
from rendering import *


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
    print(filename)
    return static_file(filename, root='game/')


@route('/upload_v2_sketch', method='POST')
def upload_sketch():
    timenow = time.time()
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    room = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
    room_path = 'game/rooms/' + room
    os.makedirs(room_path, exist_ok=True)
    sketch = from_png_to_jpg(get_request_image('sketch'))
    cv2.imwrite(room_path + '/sketch.original.jpg', sketch)
    sketch = go_tail(cli_norm(min_resize(sketch, 512)))
    print('original_sketch saved')
    s256 = go_vector(go_cal(mk_resize(sketch, 8)))[:, :, 0]
    print('s256')
    s512 = go_vector(go_cal(d_resize(sketch, s256.shape, 2.0)))[:, :, 0]
    print('s512')
    s1024 = go_vector(go_cal(d_resize(sketch, s256.shape, 4.0)))[:, :, 0]
    print('s1024')
    cv2.imwrite(room_path + '/sketch.s1024.png', s1024)
    cv2.imwrite(room_path + '/sketch.s512.png', s512)
    cv2.imwrite(room_path + '/sketch.s256.png', s256)
    print('edge processed')
    fill = double_fill(s1024, s512, s256)
    with gzip.open(room_path + '/sketch.fill', 'wb') as fp:
        pickle.dump(fill, fp)
    print('filled')
    cv2.imwrite(room_path + '/sketch.colorization.png', np.min(sketch, axis=2))
    print('sketch processed')
    print(time.time() - timenow)
    return room + '_' + ID


@route('/request_v2_result', method='POST')
def request_result():
    timenow = time.time()
    room = request.forms.get("room")
    room_path = 'game/rooms/' + room
    if not os.path.exists(room_path):
        print('Bad room skipped:' + room)
        return
    skipper = request.forms.get("skipper")
    light_r = float(request.forms.get("r"))
    light_g = float(request.forms.get("g"))
    light_b = float(request.forms.get("b"))
    light_h = float(request.forms.get("h"))
    light_max = max([light_r, light_g, light_b, light_h])
    inv4 = int(request.forms.get("inv4"))
    print('inv4=' + str(inv4))
    light_r = (light_r + 1e-5) / (light_max + 1e-5)
    light_g = (light_g + 1e-5) / (light_max + 1e-5)
    light_b = (light_b + 1e-5) / (light_max + 1e-5)
    light_h *= 600.0
    light_d = request.forms.get("d")
    need_render = int(request.forms.get("need_render"))
    print([light_r, light_g, light_b, light_d])
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    points = request.forms.get("points")
    with open(room_path + '/points.' + ID + '.txt', 'wt') as fp:
        fp.write(points)
    points = json.loads(points)
    if len(points) > 500:
        return
    for _ in range(len(points)):
        points[_][1] = 1 - points[_][1]
    with gzip.open(room_path + '/sketch.fill', 'rb') as fp:
        fill = pickle.load(fp)
    s1024 = cv2.imread(room_path + '/sketch.s1024.png', cv2.IMREAD_UNCHANGED)
    sketch = cv2.imread(room_path + '/sketch.colorization.png', cv2.IMREAD_UNCHANGED)
    print(skipper)
    if os.path.exists(room_path + '/albedo.' + skipper + '.png'):
        albedo = cv2.imread(room_path + '/albedo.' + skipper + '.png', cv2.IMREAD_UNCHANGED)
        cv2.imwrite(room_path + '/albedo.' + ID + '.png', albedo)
        print('albedo readed')
    else:
        faceID = int(request.forms.get("faceID")) - 65535
        print(faceID)
        if faceID > -1:
            print('fake ref')
            face = from_png_to_jpg(cv2.imread("refs/" + str(faceID + 1) + ".png", cv2.IMREAD_UNCHANGED))
        else:
            print('get ref')
            face = from_png_to_jpg(get_request_image('face'))
        cv2.imwrite(room_path + '/face.' + ID + '.jpg', face)
        face = s_enhance(face)
        print('request result room = ' + str(room) + ', ID = ' + str(ID))
        print('processing painting in ' + room_path)
        if inv4 > 0:
            sketch_1024 = k_resize(sketch, 64)
        else:
            sketch_1024 = k_resize(sketch, 48)
        hints_1024 = ini_hint(sketch_1024)
        hints_1024 = opreate_normal_hint(hints_1024, points, length=2, skip_sp=True)
        baby = go_head(
            sketch=sketch_1024,
            global_hint=k_resize(face, 14),
            local_hint=hints_1024
        )
        cv2.imwrite(room_path + '/baby.' + ID + '.jpg', baby)
        print('baby born')
        composition = d_resize(re_deatlize(deatlize(balance_fill(baby, fill, opreate_normal_hint(ini_hint(s1024), points, length=2, skip_sp=True), s1024)), s1024), sketch.shape)
        cv2.imwrite(room_path + '/composition.' + ID + '.jpg', composition)
        gird = process_overlay(composition, sketch)
        cv2.imwrite(room_path + '/gird.' + ID + '.jpg', gird)
        print('composition saved')
        if inv4 > 0:
            albedo = go_render(sketch_1024, d_resize(composition, sketch_1024.shape, 0.5), hints_1024)
            albedo = go_tail(albedo)
            albedo = d_resize(re_deatlize(d_resize(albedo, s1024.shape), s1024), sketch.shape)
            albedo = cv2.cvtColor(albedo, cv2.COLOR_RGB2YUV)
            albedo[:, :, 0] = go_vgg7(albedo[:, :, 0])
            albedo = cv2.cvtColor(albedo, cv2.COLOR_YUV2RGB)
        else:
            albedo = re_deatlize(d_resize(baby, s1024.shape), s1024)
            albedo = d_resize(albedo, sketch.shape, 0.25)
            albedo = go_tail(albedo)
            albedo = go_tail(albedo)
            albedo = d_resize(albedo, sketch.shape)
            boundary = sketch.astype(np.float32)
            boundary = cv2.GaussianBlur(boundary, (0, 0), 1.618) - boundary
            boundary = boundary.clip(0, 255)
            albedo = cv2.cvtColor(albedo, cv2.COLOR_RGB2HSV).astype(np.float32)
            albedo[:, :, 1] += albedo[:, :, 1] * boundary / 48.0
            albedo[:, :, 2] -= boundary
            albedo = cv2.cvtColor(albedo.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2RGB)
        cv2.imwrite(room_path + '/albedo.' + ID + '.png', albedo)
        print('albedo saved')
        if need_render == 0:
            cv2.imwrite(room_path + '/result.' + ID + '.jpg', albedo)
            cv2.imwrite('results/' + room + '.' + ID + '.jpg', albedo)
            print(time.time() - timenow)
            return room + '_' + ID
        HSV, YUV, DEL = process_albedo(albedo, composition, sketch)
        cv2.imwrite(room_path + '/HSV.' + ID + '.jpg', HSV)
        cv2.imwrite(room_path + '/YUV.' + ID + '.jpg', YUV)
        cv2.imwrite(room_path + '/DEL.' + ID + '.jpg', DEL)
        print('HSV YUV DEL')
    albedo_s1024 = d_resize(albedo, s1024.shape)
    matting = go_mat(albedo_s1024)
    matting = np.tile(matting[:, :, None], [1, 1, 3])
    matting = shade_fill(matting, fill, opreate_normal_hint(ini_hint(s1024), points, length=2, skip_sp=False), s1024)
    matting = matting[:, :, 0]
    depth = np.zeros_like(matting, dtype=np.uint8) + 255
    depth[matting < 127] = 127
    depth[s1024 < 250] = 0
    cv2.imwrite(room_path + '/depth.' + ID + '.jpg', depth)
    print('depth saved')
    normal = go_norm(depth).astype(np.float32)
    normal = ((normal + 1e-4) / (np.max(normal, axis=2, keepdims=True) + 1e-4) * 255.0).clip(0, 255).astype(np.uint8)
    normal[matting < 127] = 255
    normal = re_deatlize(normal, s1024)
    normal = d_resize(normal, sketch.shape)
    cv2.imwrite(room_path + '/normal.' + ID + '.jpg', normal)
    print('norm saved')
    mask = np.zeros_like(matting, dtype=np.uint8) + 255
    mask[matting < 127] = 0
    mask = d_resize(mask, sketch.shape)
    mask[mask < 127] = 0
    mask[mask > 0] = 255
    if int(light_d) == 0:
        result = small_render(normal, mask, albedo, s1024, r=light_r, g=light_g, b=light_b, h=light_h, left=True, top=True)
    elif int(light_d) == 1:
        result = small_render(normal, mask, albedo, s1024, r=light_r, g=light_g, b=light_b, h=light_h, left=False, top=True)
    elif int(light_d) == 2:
        result = small_render(normal, mask, albedo, s1024, r=light_r, g=light_g, b=light_b, h=light_h, left=True, top=False)
    else:
        result = small_render(normal, mask, albedo, s1024, r=light_r, g=light_g, b=light_b, h=light_h, left=False, top=False)
    if need_render == 2:
        cv2.imwrite(room_path + '/result.' + ID + '.jpg', result)
        cv2.imwrite('results/' + room + '.' + ID + '.jpg', result)
        print(time.time() - timenow)
        return room + '_' + ID
    print('result saved')
    preview = np.concatenate([np.tile(sketch[:, :, None], [1, 1, 3]), albedo, result], axis=1)
    cv2.imwrite(room_path + '/preview.' + ID + '.jpg', preview)
    print('preview saved')
    cv2.imwrite(room_path + '/result.' + ID + '.jpg', result)
    cv2.imwrite('results/' + room + '.' + ID + '.jpg', preview)
    print(time.time() - timenow)
    return room + '_' + ID


os.makedirs('game/rooms', exist_ok=True)
os.makedirs('results', exist_ok=True)

print('try')

cur_port = 8233

print('Start Serving.')
print('Open webpage http://127.0.0.1:8233/index.html to use the software.')
run(host="0.0.0.0", port=cur_port, server='paste')
