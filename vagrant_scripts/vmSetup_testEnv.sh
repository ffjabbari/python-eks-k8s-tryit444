#!/usr/bin/env bash

# Script for setting up the VM


echo "Installing Node via NVM"

sudo apt update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

source ~/.bashrc

nvm install v14.16.1

echo "Installing Artillery"

npm install -g artillery@latest
npm install -g artillery-plugin-expect

echo "Copying Over Assets"

sudo cp -a /vagrant/tests/. /home/vagrant # TEST FILES

