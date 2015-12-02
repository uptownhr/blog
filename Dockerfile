FROM node:5.0.0

# setup application files
RUN mkdir /data
WORKDIR /data
COPY . /data

# pull application packages
RUN npm install

EXPOSE 2000
CMD node app.js