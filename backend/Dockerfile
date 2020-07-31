FROM ubuntu:18.04
RUN apt-get update && apt-get install -y \
     python3-dev \
     build-essential libssl-dev libffi-dev \
     libxml2-dev libxslt1-dev zlib1g-dev swig \
     python3-pip git
RUN CFLAGS="-Wno-narrowing" pip3 install cld2-cffi
RUN pip3 install torch==1.5.1+cpu torchvision==0.6.1+cpu -f https://download.pytorch.org/whl/torch_stable.html

ADD requirements.txt /tmp/
RUN pip3 install -r /tmp/requirements.txt

RUN pip3 install tunga==1.0.61
RUN pip3 install sklearn
RUN pip3 install git+https://github.com/emres/turkish-deasciifier.git

RUN mkdir /app

COPY . /app
ENV IN_DOCKER_CONTAINER True
ENV APP_SETTINGS "project.server.config.ProductionConfig"

WORKDIR /app

EXPOSE 8080
ENTRYPOINT ["python3","manage.py","runserver","-p","8080","-h","0.0.0.0"]
