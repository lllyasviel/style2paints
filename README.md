# style2paints

The AI can automatically recognize eyes, hair, clothes, skin and so on. The AI can paint on a sketch accroding to the specific style.

The AI can not only paints on sketches, but also reconstruct the color of a finished illustration.

*Our poor guys finally failed to find a cheap server, GPU server is very expensive that we cannot afford.*

*Please contact QQ 914847518 or email at 914847518@qq.com if you would like to help us with the server.*

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/web.png"/>

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

# We are Collecting Failures

If you find a colorization failure, it can be helpful to us that you upload the sketch and your reference image [here](https://github.com/lllyasviel/style2paints/issues/7).

# Demo

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/1.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/2.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/3.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/4.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/5.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/6.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/7.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/8.jpg"/>

<img src="https://raw.githubusercontent.com/lllyasviel/style2paints/master/images/9.jpg"/>

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

# Suggestions for Reseachers

If you would like to write a paper to improve this works, you should keep in mind that:

1. It is meaningless to use sketches from your training database to show your models' result.

2. If you make a comparison, please make your model avaliable to other reseachers to see if the improvement is really true.

3. Recently many reseachers like to write paper in this way: find an old paper and replace conv layers with resnet blocks and then they have a new paper. Please stop this kind of violence.

4. It is very easy to train a model with better ability to handel one of the 'global hint' and the 'local hint'. It is hard to train a model to deal with both of them. It is NOT an improvement that you train a model to handle one of these, you need to find a balance and improve them at the same time.

*The 'global hint' is users' reference images input.*

*The 'local hint' is users' pointed color hints input.*

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

# Acknowledgements

All illustrations and sketches are from the internet and It is hard to mention all the painters.

If you find your painting in the page, you can reach us at 914847518@qq.com. We will convert our sinsere gratefulness.

If you do not like your painting being exhibited above, we will remove them at once.
