import os
import time
from tricks import *
from ai import *
from config import *
if productive:
    from gevent import monkey
    monkey.patch_all()
from bottle import route, run, static_file, request, BaseRequest
import base64
import re
import cv2
import datetime

BaseRequest.MEMFILE_MAX = 10000 * 1000
pather_text = open('game/fin.html').read()


@route('/fin/<path>')
def show_wiki_page(path):
    return pather_text.replace('<path>', path.replace('$', '/'))


@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root='game/')


@route('/')
def send_static():
    return static_file("index.html", root='game/')


@route('/paint', method='POST')
def do_paint():
    print('received')

    sketchID = request.forms.get("sketchID")

    if sketchID == 'new':
        dstr = datetime.datetime.now().strftime('%b_%d_%H_%M_%S') + '__' + str(np.random.randint(100, 999))
        sketchDataURL = request.forms.get("sketch")
        sketchDataURL = re.sub('^data:image/.+;base64,', '', sketchDataURL)
        sketchDataURL = base64.urlsafe_b64decode(sketchDataURL)
        sketchDataURL = np.fromstring(sketchDataURL, dtype=np.uint8)
        sketchDataURL = cv2.imdecode(sketchDataURL, -1)
        cv2.imwrite('record/' + dstr + '.sketch.png', sketchDataURL)
    else:
        dstr = sketchID
        sketchDataURL = cv2.imread('record/' + dstr + '.sketch.png', cv2.IMREAD_UNCHANGED)

    referenceID = request.forms.get("referenceID")

    if referenceID == 'new':
        referenceDataURL = request.forms.get("reference")
        referenceDataURL = re.sub('^data:image/.+;base64,', '', referenceDataURL)
        referenceDataURL = base64.urlsafe_b64decode(referenceDataURL)
        referenceDataURL = np.fromstring(referenceDataURL, dtype=np.uint8)
        referenceDataURL = cv2.imdecode(referenceDataURL, -1)
        referenceID = str(np.random.randint(100, 999))
        cv2.imwrite('record/' + dstr + '_' + referenceID + '.reference.png', referenceDataURL)
    else:
        if referenceID == 'no':
            referenceDataURL = None
        else:
            referenceDataURL = cv2.imread('record/' + dstr + '_' + referenceID + '.reference.png', cv2.IMREAD_UNCHANGED)

    hintDataURL = request.forms.get("hint")
    hintDataURL = re.sub('^data:image/.+;base64,', '', hintDataURL)
    hintDataURL = base64.urlsafe_b64decode(hintDataURL)
    hintDataURL = np.fromstring(hintDataURL, dtype=np.uint8)
    hintDataURL = cv2.imdecode(hintDataURL, -1)
    hstr = str(np.random.randint(100, 999))
    cv2.imwrite('record/' + dstr + '_' + hstr + '.hint.png', hintDataURL)

    sketchDenoise = request.forms.get("sketchDenoise")
    resultDenoise = request.forms.get("resultDenoise")
    algrithom = request.forms.get("algrithom")
    method = request.forms.get("method")

    sketch_config = sketchDenoise + '_' + algrithom + '_' + method

    print('sketchID: ' + sketchID)
    print('referenceID: ' + referenceID)
    print('sketchDenoise: ' + sketchDenoise)
    print('resultDenoise: ' + resultDenoise)
    print('algrithom: ' + algrithom)
    print('method: ' + method)

    t = time.time()

    sketch = from_png_to_jpg(sketchDataURL)
    raw_shape = sketch.shape

    local_hint = hintDataURL

    if referenceDataURL is not None:
        global_hint = k_resize(x=s_enhance(from_png_to_jpg(referenceDataURL), 2.0), k=14)
        local_hint[:, :, 0:3] = s_enhance(local_hint[:, :, 0:3], 1.5)
    else:
        global_hint = None

    norm_path = 'record/' + dstr + '_' + sketch_config + '.norm.jpg'
    if os.path.exists(norm_path):
        sketch = cv2.imread(norm_path, cv2.IMREAD_GRAYSCALE)
    else:
        if sketchDenoise == 'false':
            if algrithom == 'stability':
                sketch = cv_denoise(k_resize(sketch, 48))
            else:
                sketch = cv_denoise(k_resize(sketch, 64))
        else:
            if algrithom == 'stability':
                sketch = m_resize(sketch, min(sketch.shape[0], sketch.shape[1], 512))
                sketch = go_tail(sketch, noisy=True)
                sketch = k_resize(sketch, 48)
            else:
                sketch = m_resize(sketch, min(sketch.shape[0], sketch.shape[1], 768))
                sketch = go_tail(sketch, noisy=True)
                sketch = k_resize(sketch, 64)
        if method == 'transfer':
            sketch = go_line(sketch)
        else:
            sketch = cv2.cvtColor(sketch, cv2.COLOR_RGB2GRAY)
        cv2.imwrite(norm_path, sketch)

    if global_hint is None:
        tiny_sketch = sk_resize(sketch, 32)
        global_hint = k_resize(go_tail(go_dull(tiny_sketch, n_resize(k8_down_hints(local_hint), tiny_sketch.shape)), False), 14)
        cv2.imwrite('record/' + dstr + '.dull.jpg', global_hint)

    print('process: ' + str(time.time() - t))

    t = time.time()
    if algrithom == 'stability':
        local_hint = k_down_hints(local_hint)
    local_hint = d_resize(local_hint, sketch.shape)
    if method == 'render':
        painting = go_neck(sketch, global_hint, local_hint)
    else:
        painting = go_head(sketch, global_hint, local_hint)
    print('paint: ' + str(time.time() - t))

    t = time.time()
    fin = go_tail(painting, noisy=(resultDenoise == 'true'))
    fin = s_resize(fin, raw_shape)
    print('denoise: ' + str(time.time() - t))

    cv2.imwrite('record/' + dstr + '.fin.jpg', fin)
    cv2.imwrite('game/results/' + dstr + '.jpg', fin)

    return dstr + '*' + referenceID


if productive:
    run(host="0.0.0.0", port=80, server='gevent')
else:
    run(host="0.0.0.0", port=8000)
