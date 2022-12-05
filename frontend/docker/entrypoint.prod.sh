#!/bin/bash

# call docker secret expansion in env variables
source /docker/set_env_secrets.sh

# publish app
npm run build

npm start
