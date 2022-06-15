# Style2Paints V4

This is the source code of the Style2Paints V4.

# Install

You will need CUDA 10.0, CuDNN 7, Python 3.6

    cd s2p_v4_server
    pip install -r requirements.txt

Then download the model files

    https://drive.google.com/drive/folders/142ZFZUX1mpf2FOKGhf6Z7aUkQy2wNryF?usp=sharing

and put them like

    s2p_v4_server/nets/inception.net
    s2p_v4_server/nets/mat.npy
    s2p_v4_server/nets/norm.net
    ...

# Run

Simply run the python file like

    cd s2p_v4_server
    python server.py

Note that if you see something like 

    WARNING:tensorflow:No training configuration found in save file: the model was *not* compiled. Compile it manually.

Then just ignore it.

When the service is ready, you can use the software at

    http://127.0.0.1:8233/index.html

# Thanks

We thank [hepesu/LineFiller](https://github.com/hepesu/LineFiller) and [V-Sense/DeepNormals](https://github.com/V-Sense/DeepNormals) for the implementation of some basic algrithoms like flooding and normal lighting, though we do not use their models.
