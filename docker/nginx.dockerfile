FROM nginx:latest

LABEL maintainer="milletti.1884164@studenti.uniroma1.it"

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

COPY ./favicon/favicon.ico /usr/share/nginx/html/favicon.ico

EXPOSE 80
