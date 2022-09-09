FROM node:alpine3.16

RUN apk update && \
    rm -rf /var/cache/apk/*

COPY ./vue3 /app

WORKDIR /app

RUN npm install && \
    rm -rf ./dist && \
    npm run build

# use the nginx
#FROM nginx:alpine as webserver
#COPY ./dashboard/.nginx/nginx.conf /etc/nginx/nginx.conf
#
## remove the default nginx served static files
#RUN rm -rf /usr/share/nginx/html/*
#
## copy the vue files to the html folder
#COPY --from=builder /dashboard/dist /usr/share/nginx/html

#EXPOSE 3000
