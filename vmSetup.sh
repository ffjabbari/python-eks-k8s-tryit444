#!/usr/bin/env bash

# Script for setting up the VM

echo "Installing Node"

sudo apt-get install nodejs
sudo apt-get install npm

echo "Copying Over Assets"

sudo cp /vagrant/bookApp/{index.js,db-connector.js,package.json,Dockerfile,test_endpoints.json} .

echo "Installing Dependencies"

sudo npm install

echo "Testing the Application"

sudo npm install -D artillery@1.6 --save
sudo artillery run test_endpoints.json

# echo "Building the Docker Image"
# docker build --tag bookapp:1.0 .
# docker container run -d -p 3000:3000 bookapp:1.0