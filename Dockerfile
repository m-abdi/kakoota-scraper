FROM node:latest
RUN npm i
CMD [ "node", "bot.js" ]