###############################################################################################
# Psychmatch nlp-model - BASE
###############################################################################################
FROM python:3.12.0a1 as psychmatch-nlp-model-base

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN mkdir -p /docker

# update the image
RUN apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update
RUN apt-get upgrade -y
RUN apt-get install vim -y
RUN apt-get install net-tools -y
RUN apt-get install dos2unix -y

# install dependencies
RUN pip install gensim
RUN pip install Flask
RUN pip install nltk

# install spacy
RUN pip install spacy
RUN python -m spacy download en_core_web_lg

# download the model
COPY ./src/utils.py /usr/src/app/utils.py
COPY ./src/download_model.py /usr/src/app/download_model.py
RUN python /usr/src/app/download_model.py

###############################################################################################
# Psychmatch nlp-model - DEVELOPMENT
###############################################################################################
FROM psychmatch-nlp-model-base as psychmatch-nlp-model-dev

COPY ./docker/entrypoint.sh /docker
RUN chmod +x /docker/entrypoint.sh
RUN dos2unix /docker/entrypoint.sh

# publish app
EXPOSE 5000
ENTRYPOINT [ "/docker/entrypoint.sh" ]

###############################################################################################
# Psychmatch nlp-model - PRODUCTION
###############################################################################################
FROM psychmatch-nlp-model-base as psychmatch-nlp-model-deploy

COPY ./src/ /usr/src/app/

COPY ./docker/entrypoint.prod.sh /docker
RUN chmod +x /docker/entrypoint.prod.sh
RUN dos2unix /docker/entrypoint.prod.sh

EXPOSE 5000
ENTRYPOINT [ "/docker/entrypoint.prod.sh" ]