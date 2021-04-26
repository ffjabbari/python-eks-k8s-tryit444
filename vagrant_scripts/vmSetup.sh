#!/usr/bin/env bash

# Script for setting up the VM

echo "Installing Node"

sudo apt-get install nodejs
sudo apt-get install npm

echo "Copying Over Assets"

sudo cp /vagrant/bookService/ .
sudo cp /vagrant/bookBFF/ .
sudo cp /vagrant/customerService/ .
sudo cp /vagrant/customerBFF/ .

sudo cp -a /vagrant/tests/. /home/vagrant # TEST FILES

echo "Installing Dependencies"

sudo npm install

echo "Testing the Application"

sudo npm install -g artillery@latest
sudo npm install -g artillery-plugin-expect
# sudo artillery run test_bookBFF.yml

# echo "Building the Docker Images"
# cd /bookService
# sudo docker build --tag book_service:1.0 .
# cd ../
# cd /bookBFF
# sudo docker build --tag book_bff:1.0 .
# cd ../
# cd /customerService
# sudo docker build --tag customer_service:1.0 .
# cd ../
# cd /customerBFF
# sudo docker build --tag customer_bff:1.0 .

# echo "Running the docker containers"
# sudo docker container run -d -p 3001:3000 customer_service:1.0 
# sudo docker container run -d -p 3002:3000 book_service:1.0
# sudo docker container run -d -p 81:80 customer_bff:1.0 
# sudo docker container run -d -p 82:80 book_bff:1.0 