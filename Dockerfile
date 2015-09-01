FROM node

# setup application files
RUN mkdir /data
WORKDIR /data
COPY . /data

# pull application packages
RUN npm install
RUN npm install -G forever

VOLUME ["/data"]
EXPOSE 9999
CMD forever start app.js && forever logs app.js -f