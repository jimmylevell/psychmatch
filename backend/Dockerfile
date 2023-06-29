###############################################################################################
# Psychmatch backend - BASE
###############################################################################################
FROM node:19.9.0 as psychmatch-backend-base

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
# Psychmatch backend - DEVELOPMENT
###############################################################################################
FROM psychmatch-backend-base as psychmatch-backend-dev

RUN mkdir -p /docker
COPY ./docker/entrypoint.sh /docker
RUN chmod +x /docker/entrypoint.sh
RUN dos2unix /docker/entrypoint.sh

# publish app
EXPOSE 3000
ENTRYPOINT [ "/docker/entrypoint.sh" ]

###############################################################################################
# Psychmatch backend - PRODUCTION
###############################################################################################
FROM psychmatch-backend-base as psychmatch-backend-deploy

# Install app dependencies
COPY . .
RUN npm install

COPY ./docker/entrypoint.prod.sh /docker
RUN chmod +x /docker/entrypoint.prod.sh
RUN dos2unix /docker/entrypoint.prod.sh

EXPOSE 3000
ENTRYPOINT [ "/docker/entrypoint.prod.sh" ]
