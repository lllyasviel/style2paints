# News

The server of Style2paintsV4 (s2p.moe) is currently shut down because we do not have enough money. The GPU server (1000USD/MONTH) is costly. You can donate us if you like our previous service.

[patreon](https://www.patreon.com/style2paints)
[支付宝](https://s2p.moe/img/zfb.jpg)
[微信支付](https://s2p.moe/img/wx.jpg)

We will release all source codes of Style2paintsV4, including the server code (Python), the client code (Cocos2D-JS), the pretrained model (Keras) and some possible helpers (Chrome plugin) after some technique report is released.

Currently, the only publicly available version is style2paintsV3, which can be found [here](https://github.com/lllyasviel/style2paints/tree/master/V3). However, this page is only designed for the programmer. If you are an artist and want to colorize line drawings, we recommend you to use the alternative tool PaintsChainer, which can be found [here](https://paintschainer.preferred.tech/).

Though the possibility is minimal, the online APP of style2paints V4 may come back if we manage to obtain enough donation.

We are currently actively developing Style2PaintsV5, which is the top secret of our team. Style2PaintsV5 is not only capable of coloring, but more importantly, it may help you to draw.

We are actively developing the offline version of Style2PaintsV4 (and MangaCraft), you will be able to run our APP on your host when our online server is not accessible. Maybe the offline version will be released together with Style2PaintsV5. Furthermore, Style2PaintsV5 is an offline APP.

Thank you all for your support!

# Welcome to style2paints V4!

![logo](https://github.com/lllyasviel/style2paints/raw/master/imgs/pages/logo.jpg)

Style2paints V4 is the current best AI driven lineart colorization tool.

Different from previous end-to-end image-to-image translation methods, style2paints V4 is the **first** system to colorize a lineart **in real-life human workflow**, and the outputs are **layered**.

Inputs:

    ● Linearts
    ● (with or without) Human hints
    ● (with or without) Color style reference images
    ● (with or without) Light location and color

Outputs:

    ● Automatic color flattening without lines (solid/flat/inherent/固有色/底色 color layer)
    ● Automatic color flattening with black lines
    ● Automatic colorization without lines
    ● Automatic colorization with black lines
    ● Automatic colorization with colored lines
    ● Automatic rendering (separated layer)
    ● Automatic rendered colorization

Style2paints V4 gives you results of the current highest quality. You are able to get separated layers from our system. These layers can be directly used in your painting workflow. Different from all previous AI driven colorization tools, our results are not single 'JPG/PNG' images, and in fact, our results are 'PSD' layers.

Online APP: [http://s2p.moe/](http://s2p.moe/) (Currently not accessible.)

User Instruction: [https://style2paints.github.io/](https://style2paints.github.io/)

And we also have an official [Twitter](https://twitter.com/IlIIlIIIllIllII) account.

# Help human in their standard coloring workflow!

Most human artists are familiar with this workflow:

    sketching -> color filling/flattening -> gradients/details adding -> shading

And the corresponding layers are:

    lineart layers + flat color layers + gradient layers + shading layers

Style2paints V4 is designed for this standard coloring workflow! In style2paints V4, you can automatically get separated results from each step!

# Examples

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/pip.jpg)

Here we present some results in this ABCD format. Users only need to upload their sketch, select a style, and put a light source. 

When the result is achieved immediately without any human color correction, we regard this result as **fully automatic result**. When the result needs some color correction, human can easily put some color hints on the canvas to guide the AI coloring process. In this case, we regard these results as **semi-automatic results**. If a result is semi-automatic, but the quantity of human color hint points is smaller than 10, we regard these results as **almost automatic result**. In this section, about half of the presented results are **fully automatic result**, and the others are all **almost automatic result**. Do notice that all the below results can be achieved with less than 15 clicks!

**Here we provide a video to show how all below results are achieved.**

The video is a pure screen record without any after modification or speed modification. 

Here is the video: [https://youtu.be/B6WEky9nY7Q](https://youtu.be/B6WEky9nY7Q)

And all input sketches can be found [here](https://github.com/lllyasviel/style2paints/raw/master/temps/show/sketches).

*(Because this page is prepared before the video is recoreded, some numbers may have minor differences.)*

## Example #1

Begin at 11:28 in the above video.

All human local color modification: only 3 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/8.jpg)

*\*CC-BY-NC-SA-4.0 (c) Various artist of style2paints team, 2018. This image is OK for ACM/IEEE fair use.*

## Example #2

Begin at 06:19 in the above video.

All human local color modification: only 2 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/5.jpg)

*\*CC-BY-NC-SA-4.0 (c) Various artist of style2paints team, 2018. This image is OK for ACM/IEEE fair use.*

## Example #3

Begin at 01:40 in the above video.

All human local color modification: only 6 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/2.jpg)

*\*CC-BY-NC-SA-4.0 (c) Various artist of style2paints team, 2018. This image is OK for ACM/IEEE fair use.*

## Example #4

Begin at 00:42 in the above video.

All human local color modification: NO human color modification.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/1.jpg)

*\*CC-BY-NC-SA-4.0 (c) Various artist of style2paints team, 2018. This image is OK for ACM/IEEE fair use.*

## Example #5

Begin at 02:57 in the above video.

All human local color modification: NO human color modification.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/3.jpg)

*\*CC-BY-NC-SA-4.0 (c) Various artist of style2paints team, 2018. This image is OK for ACM/IEEE fair use.*

## Example #6

Begin at 07:57 in the above video.

All human local color modification: 11 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/6.jpg)

## Example #7

Begin at 13:00 in the above video.

All human local color modification: only 6 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/9.jpg)

*\*CC-BY-NC-4.0 (c) Henjo. Only for this presentation.*

## Example #8

Begin at 04:27 in the above video.

All human local color modification: only 3 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/4.jpg)

## Example #9

Begin at 09:46 in the above video.

All human local color modification: only 5 clicks.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/7.jpg)

*\*CC-BY-NC-SA-4.0 (c) Various artist of style2paints team, 2018. This image is OK for ACM/IEEE fair use.*

# Real-life results

To validate a really effective, useful, robust, generizable and scalable system, we firmly believe that the only convincing evidence is its real-life performance form real industry, real market, and real users.

In this section, we present real-life results from twitter artists. We are sorry that we can only provide low-resolution screenshots because we do not own the copyrights of these images. These twitters can be found by searching keyword “style2paints” and “s2p.moe” on twitter. Additionally, there are also lots of results under twitter hashtag #style2paints. These results are from artists from different countries. Note that some (very minor) results contains artists' after effect decorations. Note that some of these artists did not share their original sketch inputs on twitter.

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/a.png)

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/b.png)

![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/1.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/2.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/3.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/4.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/5.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/6.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/7.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/8.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/9.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/10.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/11.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/12.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/13.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/14.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/15.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/16.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/17.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/18.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/19.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/20.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/21.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/22.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/23.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/24.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/25.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/26.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/27.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/28.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/29.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/30.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/31.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/32.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/33.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/34.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/35.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/36.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/37.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/38.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/39.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/40.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/41.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/42.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/43.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/44.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/45.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/46.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/47.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/48.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/49.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/50.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/51.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/52.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/53.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/54.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/55.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/56.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/57.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/58.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/59.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/60.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/61.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/62.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/63.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/64.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/65.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/66.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/67.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/68.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/69.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/70.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/71.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/72.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/73.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/74.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/75.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/76.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/77.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/78.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/79.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/80.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/81.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/82.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/83.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/84.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/85.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/86.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/87.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/88.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/89.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/90.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/91.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/92.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/93.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/94.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/95.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/96.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/97.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/98.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/99.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/100.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/101.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/102.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/103.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/104.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/105.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/106.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/107.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/108.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/109.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/110.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/111.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/112.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/113.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/114.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/115.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/116.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/117.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/118.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/119.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/120.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/121.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/122.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/123.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/124.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/125.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/126.jpg)
![logo](https://github.com/lllyasviel/style2paints/raw/master/temps/show/t/127.jpg)

# Know more about us!

Online APP: [http://s2p.moe/](http://s2p.moe/)

User Instruction: [https://style2paints.github.io/](https://style2paints.github.io/)

And we also have an official [Twitter](https://twitter.com/IlIIlIIIllIllII) account.

# Acknowledgement

Thanks a lot to TaiZan. This project could not be achieved without his great help.

# About Copyright

We won’t claim any additional copyright of the colorized manga, but we would be delightful if you share our software with your friends.

Furthermore, if you want to use our software in large-scale commercial or industrial production or publication, e.g. manga (entity paper manga or online e-manga), magazine, book or other online/offline large-scale materials, please contact us for permission:

    914847518@qq.com
    Please attach following materials when e-mailing us:
    The name and additional information of the commercial publication.
    The quantity of pages you are willing to print.
    The sample images of the black-and-white manga and the sample pages colored via our software.

With our permission, you can enjoy more professional services with our cutting-edge technologies. Please do not use our software for large-scale commercial or industrial publications without our approval.

# 中文社区

欢迎加入以下qq群，但是不保证一直有空位，如果你一次加群失败，可以多次尝试。

    纸片协会总舵-圣辇船：184467946

# Previous Publications

## Style2paints V1:

ACPR 2017:

    @Article{ACPR2017ZLM,
      author  = {LvMin Zhang, Yi Ji and ChunPing Liu},
      title   = {Style Transfer for Anime Sketches with Enhanced Residual U-net and Auxiliary Classifier GAN},
      conference = {Asian Conference on Pattern Recognition (ACPR)},
      year    = {2017},
    }

[paper](https://arxiv.org/abs/1706.03319)

## Style2paints V2:

No Publications.

## Style2paints V3:

TOG 2018:

    @Article{ACMTOGTSC2018,
      author  = {LvMin Zhang, Chengze Li, Tien-Tsin Wong, Yi Ji and ChunPing Liu},
      title   = {Two-stage Sketch Colorization},
      journal = {ACM Transactions on Graphics},
      year    = {2018},
      volume  = {37},
      number  = {6},
      month   = nov,
      doi     = {https://doi.org/10.1145/3272127.3275090},
    }

[paper](https://github.com/lllyasviel/style2paints/blob/master/papers/sa.pdf)

## Style2paints V4:

No Publications.









