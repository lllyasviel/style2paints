# Style2Paints V4.5

This is the source code of the Style2Paints V4.5. In this forlder, the codes implements the functionality of what can be achieved in the compiled software "style2paints45beta1214B.zip".

# Install

You will need CUDA 10.0, CuDNN 7, Python 3.6

    pip install opencv-contrib-python==4.1.0.25
    pip install tensorflow_gpu==1.14.0
    pip install bottle==0.12.10
    pip install tqdm

Then download the software "style2paints45beta1214B.zip", put the model files like

    s2p_v45_server/nets/inception.net
    s2p_v45_server/nets/gau.npy
    s2p_v45_server/nets/refs.net
    ...

# Run

Simply run the python file "Style2PaintsV45_source.py" like

    cd s2p_v45_server
    python Style2PaintsV45_source.py

Note that if you see something like 

    WARNING:tensorflow:No training configuration found in save file: the model was *not* compiled. Compile it manually.

Then just ignore it.

When the service is ready, you can use the software at

    http://127.0.0.1:8233/index.html

# Client Source Code

The user interface is written in Cocos Creator. Although you do not need to touch the client UI code, if you want to do so, you may need [Cocos Creator](https://www.cocos.com/creator).
