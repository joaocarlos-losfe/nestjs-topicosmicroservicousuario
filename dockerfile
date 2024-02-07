FROM node:20.10
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
COPY .env ./
EXPOSE 3001
EXPOSE 80
CMD [ "npm", "run", "start:prod", "0.0.0.0:3001"]