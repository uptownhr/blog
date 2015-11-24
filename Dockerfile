FROM iojs

# setup application files
RUN mkdir /data
WORKDIR /data
COPY . /data

# pull application packages
RUN npm install
RUN npm install -g gulp
RUN gulp css-bundle
RUN gulp browserify
RUN npm install -g forever

EXPOSE 9999
CMD forever start app.js && forever logs app.js -f