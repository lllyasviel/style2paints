FROM lefant/python3-keras

# Run the resulting docker image with nvidia-docker.
# Note, the following files should have already been extracted: base_generator.net  google_net.net  style2paints.net

RUN pip3 install chainer cupy bottle gevent h5py opencv-python
RUN git clone https://github.com/lllyasviel/style2paints.git
COPY *.net style2paints/server/
RUN apt-get install -y libcudnn6-dev=6.0.21-1+cuda8.0
WORKDIR style2paints/server/
CMD python3 server.py # Runs on port 8000
