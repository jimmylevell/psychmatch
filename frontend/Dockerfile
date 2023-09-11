###############################################################################################
# Psychmatch - Frontend - Base
###############################################################################################
FROM node:20.6.0 as psychmatch-frontend-base

RUN mkdir -p /srv/app
WORKDIR /srv/app

RUN mkdir -p /docker

# update the image
RUN apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update
RUN apt-get upgrade -y
RUN apt-get install vim -y
RUN apt-get install net-tools -y
RUN apt-get install dos2unix -y

###############################################################################################
# Psychmatch - Frontend - DEVELOPMENT
###############################################################################################
FROM psychmatch-frontend-base as psychmatch-frontend-dev

COPY ./docker/entrypoint.sh /docker
RUN chmod +x /docker/entrypoint.sh
RUN dos2unix /docker/entrypoint.sh

EXPOSE 3100
ENTRYPOINT [ "/docker/entrypoint.sh" ]

###############################################################################################
# Psychmatch - Frontend - PRODUCTION
###############################################################################################
FROM psychmatch-frontend-base as psychmatch-frontend-deploy

# Install app dependencies
COPY . .
RUN npm install

COPY ./docker/entrypoint.prod.sh /docker
COPY ./docker/set_env_secrets.sh /docker

RUN chmod +x /docker/entrypoint.prod.sh
RUN chmod +x /docker/set_env_secrets.sh

RUN dos2unix /docker/entrypoint.prod.sh
RUN dos2unix /docker/set_env_secrets.sh

EXPOSE 3100
ENTRYPOINT [ "/docker/entrypoint.prod.sh" ]
