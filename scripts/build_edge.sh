#!/bin/sh

# update the system
apk update

# install required dependencies
apk add sudo sox npm nodejs

# give permission to /.npm directory
chmod -R 777 /root

# clear cache
rm -rf /var/cache/apk/*

# starting app build
cd ./vue3

# delete previously built directory
rm -rf ./dist

# start build
npm install && npm run build

