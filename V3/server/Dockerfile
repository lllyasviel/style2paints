FROM tensorflow/tensorflow:1.13.2-gpu-py3

RUN apt-get update &&  \
    apt-get install -y build-essential libsm6 libxext6 libxrender-dev libxrender1 libfontconfig1
RUN pip install --upgrade pip

ADD . /app

WORKDIR /app

RUN pip install -r requirements.txt

CMD ["python", "server.py"]
