FROM node:latest
WORKDIR /app
RUN npm install -g yarn
COPY package*.json .
RUN yarn
COPY . .
ENV NODE_ENV=production
CMD [ "yarn", "start" ]