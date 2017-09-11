# STYLE2PAINTS

The AI can paint on a sketch accroding to a given specific color style.

The AI can also reconstruct the color of a finished illustration (unstable).

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

# Demo

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/19.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/18.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/1.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/2.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/3.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/4.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/5.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/6.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/7.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/8.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/10.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/11.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/12.jpg"/>

# Style Reconstruction for Illustrations

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/13.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/14.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/15.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/16.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/17.jpg"/>

# More results

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/preview_1.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/preview_2.jpg"/>

# Failures

We are collecting colorization failures [here](https://github.com/lllyasviel/style2paints/blob/master/failures.md).

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

# Acknowledgements

All illustrations and sketches are from the internet and It is hard to mention all the painters.

If you find your painting in the page, you can reach us at 914847518@qq.com. We will convert our sinsere gratefulness.

If you do not like your painting being exhibited above, we will remove them at once.
