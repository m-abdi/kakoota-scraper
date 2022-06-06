FROM node:latest
RUN yarn
CMD [ "yarn", "start" ]