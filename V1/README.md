# Lastest News

**Style2paints V2 is coming soon with better color!**

**Our new UI (Style2paints V1) is under construction now. You can try it directly!**

PaintsTransfer: [http://paintstransfer.com/](http://paintstransfer.com/)


# You have just found STYLE2PAINTS

:pushpin:[GithubPage](https://lllyasviel.github.io/) :pushpin:[GithubPageChinese](https://lllyasviel.github.io/chinese) :pushpin:[StyleTransfer](https://github.com/lllyasviel/style2paints/blob/master/AnimeStyleTransfer.md)

*The previous version is now at 52.80.94.56:8000*

The AI can paint on a sketch according to a given specific color style.

The AI can transfer illustrations' style.



# Tuitions

[tuition 001](https://www.bilibili.com/video/av15014229/)

# CPU Server for Beginner

*you need a python 3 environment.*

    pip install tensorflow
    pip install keras
    pip install chainer
    pip install bottle
    pip install gevent
    pip install h5py
    pip install opencv-python
    git clone https://github.com/lllyasviel/style2paints.git
    (then download all pretrained models from 'release' page and then put them in 'style2paints/server')
    cd style2paints/server
    python server.py cpu

# GPU Server for Reseachers

*you need a CUDA python 3.6 environment.*

    pip install tensorflow_gpu
    pip install keras
    pip install chainer
    pip install cupy
    pip install bottle
    pip install gevent
    pip install h5py
    pip install opencv-python
    git clone https://github.com/lllyasviel/style2paints.git
    (then download all pretrained models from 'release' page and then put them in 'style2paints/server')
    cd style2paints/server
    python server.py

# Model

Models lost (add at 2018.12.1)

1. base_generator.net -> all rights reserved 2017 style2paints
2. style2paints.net -> all rights reserved 2017 style2paints
3. google_net.net -> from [nico-opendata](https://nico-opendata.jp/en/demo/tag/index.html)

# Training Datasets

1. The recommended training dataset of illustrations is the 400k images from [nico-opendata](https://nico-opendata.jp/en/seigadata/index.html)

2. The recommended training sketches is from [sketchKeras](https://github.com/lllyasviel/sketchKeras)

# Community

QQ Group ID: 184467946

## Acknowledgements

Thanks a lot to TaiZan. This project could not be achieved without his great help.
