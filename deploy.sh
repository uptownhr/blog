#!/bin/bash

cd /root/blog
git pull
docker build -t blog .
docker-compose up -d
docker rmi $(docker images | grep "^<none>" | awk '{print $3}')
