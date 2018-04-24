# COUNTDOWN

## ~2018.4.21 -> 7 days before PaintsTransfer V3~

## ~2018.4.22 -> 6 days before PaintsTransfer V3~

## ~2018.4.23 -> 5 days before PaintsTransfer V3~

## 2018.4.24 -> 4 days before PaintsTransfer V3

## 2018.4.25 -> 3 days before PaintsTransfer V3

## 2018.4.26 -> 2 days before PaintsTransfer V3

## 2018.4.27 -> 1 days before PaintsTransfer V3

## 2018.4.28 - PaintsTransfer V3 !!!

    2018.04.28 23:59 CST. This github page will be updated.
    2018.04.29 00:00 - 02:00 CST. Server will be OK.
    2018.04.30 - 2018.05.02 We will have a post on reddit.

# STYLE2PAINTS 2.1

~First of all, why not spend 5 minutes to try it yourself!~

~http://paintstransfer.com~

**Our server will be ok when PaintsTransfer V3 released.**

The AI can paint on a sketch according to a given specific color style.

The AI can create its own color style to paint on a sketch.

The AI can transfer illustrations' style.

# Latest News

2018.4.16 - We changed our time schedule:

    1. PaintsTransfer V3 will have an online demo, and V2 demo will not be avaliable online anymore.
    2. PaintsTransfer V3 can do all what V2 can do (in theory).
    3. PaintsTransfer V3 will be renamed into PaintsTransfer-Euclid V1.0.
    4. PaintsTransfer-Euclid will be released at 2018.04.28 23:59 CST.

2018.4.13 - A good news: PaintsTransfer V3 is decided to be released at 2018.04.28-2018.04.30. Have a magical day!

2018.4.13 - A good news: We finally get the server. PaintsTransfer V2 will be avaliable again before 2018.04.13.

2018.4.6 - A bad news: We have developed paintstransfer V3, but it is defeated by V2. Theoretically, the deeper V3 should be better than V2 but our user studies show that V2 is still the best painter. 

*The consequence is:*

    50% possibility: We will combine some good part of unfinished V3 into V2 and release V2.5. 
                     And V3 will not be released.
    50% possibility: We will improve V3 and release V3.


2018.2.12 - PaintsTransfer 3.0 will be released in 2018.04.25-2018.05.15. We will use a totally non-residual very deep model.

2018.2.3 - We added the *super accurate pencil*, and the original pencil tool is replaced by *brush*. The problem of over colorization in non-reference mode is fixed when you use the *super accurate pencil*, and the color spreading of *super accurate pencil* is limited to a relative small degree.

# Tutorial

[Tutorial001(BiliBili)](https://www.bilibili.com/video/av17537429/)

# Results with Hints

**We are the most accurate anime colorization AI to obey your hints!**

*All results below are achieved with one reference image and some human hints.*

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/001.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/002.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/003.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/011.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/004.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/005.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/006.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/007.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/008.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/009.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/010.png)

# Results without Hints

**We are the most creative anime colorization AI without your hints!**

*All results below are achieved **WITHOUT** any reference image or human hints.*

**IMPORTANT: Here the only inputs is one sketch.**

**IMPORTANT: NO human hint and NO reference is involved!**

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/012.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/013.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/014.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/015.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/016.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/017.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/018.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/019.png)

![web_preview](https://raw.githubusercontent.com/lllyasviel/style2paints/master/tempfile/020.png)

# Launch Server

*you need a python 3.5/3.6 GPU environment with cuda.*

    pip install tensorflow_gpu
    pip install keras
    pip install bottle
    pip install gevent
    pip install h5py
    pip install opencv-python
    pip install scikit-image
    git clone https://github.com/lllyasviel/style2paints.git
    (Then you need to download all models from our Google Drive and put these into 'server' folder.)
    cd style2paints/server
    python server.py

# Models

Currently, we reserve all rights about all these models. 

We use Google Drive to upload models:

    https://drive.google.com/open?id=1fWi4wmNj-xr-nCzuWMsN2rcm0249_Aem
    
Current model list of the 8 neural networks:

    base_head.net
    dull_head.net
    gate_head.net
    line_head.net
    base_neck.net
    clear_tail.net
    noise_tail.net
    base_reader.net

# Training Datasets

1. The recommended training dataset of illustrations is the 400k images from [nico-opendata](https://nico-opendata.jp/en/seigadata/index.html)

2. The recommended training sketches is from [sketchKeras](https://github.com/lllyasviel/sketchKeras)

# Community

QQ Group ID: 184467946

## Acknowledgements

Thanks a lot to TaiZan. This project could not be achieved without his great help.
