FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV KAFKA_HOST=kafka
ENV KAFKA_PORT=9092

EXPOSE 3000

CMD ["npm", "run", "start"]