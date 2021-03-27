#!/usr/bin/env bash

# Script for setting up the VM

echo "Installing Node"

sudo apt-get install nodejs
sudo apt-get install npm

echo "Copying Over Assets"

cp /vagrant/bookApp/{index.js,db-connector.js,package.json,Dockerfile} .

echo "Installing Dependencies"

npm install

# docker build --tag bookapp:1.0 .
# docker container run -d -p 8080:8080 bookapp:1.0