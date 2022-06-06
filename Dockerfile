FROM node:latest
RUN npm install -g yarn
RUN yarn
CMD [ "yarn", "start" ]