#!/usr/bin/env bash

# Script for setting up the VM

echo "Installing Node"

sudo apt-get install nodejs
sudo apt-get install npm
npm install express --save

echo "Copying Over Assets"

cp /vagrant/bookApp/package.json .
cp -r /vagrant/bookApp/node_modules/ .
cp /vagrant/bookApp/index.js .