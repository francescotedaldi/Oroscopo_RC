FROM node:latest

LABEL maintainer="milletti.1884164@studenti.uniroma1.it"

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

COPY package.json .

RUN npm install -g nodemon

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]