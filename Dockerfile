FROM node:24

WORKDIR /nest-app

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "start:prod" ]

