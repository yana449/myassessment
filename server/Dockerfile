FROM node:18-slim

WORKDIR /usr/src/server

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]