FROM node:20-apline

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7000

CMD ["npm", "run", "dev"]