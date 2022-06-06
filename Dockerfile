FROM node:latest
WORKDIR /app
RUN npm install -g yarn
COPY package*.json .
RUN yarn
COPY . .
CMD [ "yarn", "start" ]