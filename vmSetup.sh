#!/usr/bin/env bash

# Script for setting up the VM

echo "Installing Node"

sudo apt-get install nodejs
sudo apt-get install npm

echo "Copying Over Assets"

cp /vagrant/bookApp/{index.js,db-connector.js,package.json,Dockerfile,test_endpoints.json} .

echo "Installing Dependencies"

npm install

# echo "Testing the Application"
# artillery run test_endpoints.json

# echo "Building the Docker Image"
# docker build --tag bookapp:1.0 .
# docker container run -d -p 3000:3000 bookapp:1.0