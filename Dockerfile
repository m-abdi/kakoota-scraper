FROM node:latest
RUN npm install -g yarn
RUN yarn install
CMD [ "yarn", "start" ]