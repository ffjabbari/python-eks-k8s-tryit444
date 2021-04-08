# booksApp - A microservice template 

##### A microservice architecture for Books management: 

This project uses a MySQL AWS RDS backend, and a lightweight Linux/Docker orchestration running on AWS EC2. 

<hr>

Bundled with **2 independently scalable microservices**:

1. bookService
2. customerService

* each running NodeJS / Express API
* handle biz & logic concerns

And **2 BFFs** (backend-for-frontends)

1. bookBFF
2. customerBFF

* each running a Python server
* handle header parsing, auth, and response transformations
  * (on a user-client basis — ie. different responses for Desktop / Mobile)

The following **Infrastructure as Code** is provided here:

* All the services are deployed via Docker (Dockerfiles provided in reach respective directory)
  * See the [setup script](vmSetup.sh) for help with a docker deployment
* A `Vagrantfile` & `vmSetup.sh` scripts are provided for setting up a development env in a VM
  * Install `Vagrant` & `VirtualBox`
  * run `vagrant up` to start the VM
  * run `vagrant ssh` to enter the VM
* An artillery testing script (in the root dir) is provided for one of the services
  * see the [setup script](vmSetup.sh) for help running it


### mk
