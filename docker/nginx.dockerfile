FROM nginx:latest

LABEL maintainer="milletti.1884164@studenti.uniroma1.it"

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

COPY ./favicon/favicon.ico /usr/share/nginx/html/favicon.ico

COPY ./security/server.cert /etc/nginx/server.cert

COPY ./security/server.key /etc/nginx/server.key

EXPOSE 80

EXPOSE 443
