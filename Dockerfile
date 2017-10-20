FROM node:8-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY ./app ./app
EXPOSE 3000
CMD npm start
