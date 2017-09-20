# STYLE2PAINTS

[ZhiHu](https://zhuanlan.zhihu.com/p/29331219) [BiliBili](https://www.bilibili.com/video/av14443094/)

The AI can paint on a sketch accroding to a given specific color style.

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/screen_shot.png)

# Example 1

A content sketch (**the first google image search result of key word 'anime sketch'**) and some style images:

.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/demo1.jpg" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/demo1_styles.png" height = "300"/>
.

Results:

.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled8.png" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled1.png" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled2.png" height = "300"/>
.

.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled3.png" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled6.png" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled7.png" height = "300"/>
.

.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled4.png" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled5.png" height = "300"/>
.
<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/page/untitled0.png" height = "300"/>
.

# Requirement

    pip install tensorflow_gpu
    pip install keras
    pip install chainer
    pip install cupy
    pip install bottle
    pip install h5py
    pip install opencv-python

# Launch Server

    git clone https://github.com/lllyasviel/style2paints.git
    (then download all pretrained models from 'release' page and then put them in 'style2paints/server')
    cd style2paints/server
    python server.py

# Model

Models are avaliable in 'release' page.

1. base_generator.net            all rights reserved 2017 style2paints
2. paintschainer.net             from [paintschainer](https://github.com/pfnet/PaintsChainer)
3. google_net.net                from [nico-opendata](https://nico-opendata.jp/en/demo/tag/index.html)

# Training Datasets

1. The recommended training dataset of illustrations is the 400k images from [nico-opendata](https://nico-opendata.jp/en/seigadata/index.html)

2. The recommended training sketches is from [sketchKeras](https://github.com/lllyasviel/sketchKeras)

# Community

QQ Group ID: 184467946

# Paper Reference

The paper is accecped by ACPR 2017.

    @article{StyleTansferForAnime,
        Author = {Lvmin Zhang and Yi Ji and Xin Lin},
        Title = {Style Transfer for Anime Sketches with Enhanced Residual U-net and Auxiliary Classifier GAN},
        Journal = {arXiv:1706.03319},
        Year = {2017}
    }
