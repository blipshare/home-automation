FROM node:alpine3.16

ARG USERNAME=node
#ARG GROUP=appgroup

#RUN addgroup -S $GROUP && \
#    adduser -S $USERNAME -G $GROUP && \
#    
RUN apk update && \
    apk add sudo sox && \
    rm -rf /var/cache/apk/*

COPY ./vue3 /app

WORKDIR /app

RUN rm -rf ./dist && \
    chown -R $USERNAME /app && \
    npm install && \
    npm run build

# Set the default user.
USER $USERNAME

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
