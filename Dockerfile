FROM node

WORKDIR /usr/src/app

WORKDIR /app
COPY package*.json .
COPY prisma ./prisma/
RUN npm install
COPY . .

EXPOSE 5555
CMD ["npm", "run", "start:migrate:prod"]

# nodemon -L --inspect=0.0.0.0 index.js
# sms oplata