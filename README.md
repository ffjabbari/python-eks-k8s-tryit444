# booksApp - A microservice template

##### My sample microservice architecture (for Books management):

This project uses a MySQL `AWS RDS` backend, and a lightweight `k8s`/`Docker`orchestration running on`AWS EKS`.

<hr>

### Bundled with...

##### 2 independently scalable microservices:

1. bookService
2. customerService

* each running NodeJS / Express API
* handle biz & logic concerns

##### 2 BFFs (backend-for-frontends)

1. bookBFF
2. customerBFF

* each running a Python server
* handle header parsing, auth, and response transformations
  * (on a user-client basis — ie. different responses for Desktop / Mobile)

##### & 1 Circuit Breaker (for an external service)

1. reccCircuitBreaker

* Sets a 3 minute timeout for calls to the service and returns error codes appropriately
  * 504 - Timeout / 503 - Closed Circuit / 204 - Not Found / 200 - Success

<hr>

#### k8s Deployment

Config files for k8s deployment are provided at the top-level project directory.

1. Apply the k8s config with: `kubectl apply -f circuitBreakerConfig.yaml -f bookConfig.yaml -f customerConfig.yaml`
2. See all services / pods: `kubectl get all -n book-app`

**Other Helpful Commands****

1. See Container Logs: `kubectl logs -n book-app <POD ID> <CONTAINER NAME>`
2. SSH into Pod: `kubectl exec -it <POD ID> -n book-app -- bash`
3. Describe Pod: `kubectl describe pods -n book-app <POD ID>`
4. Restart Deployment (ie. after updating some container): `kubectl rollout restart deployment <DEPLOYMENT NAME> -n book-app`

##### Additional Infrastructure as Code / *IAC*

* All the services can be deployed via Docker (Dockerfiles provided in each respective directory)
  * See the [setup script](vmSetup.sh) for help with a docker deployment
* A `Vagrantfile` & `vmSetup.sh` scripts are provided for setting up a development env in a VM
  * Install `Vagrant` & `VirtualBox`
  * run `vagrant up` to start the VM
  * run `vagrant ssh` to enter the VM
* An artillery testing script (in the root dir) is provided for one of the services
  * see the [setup script](vmSetup.sh) for help running it

### mk
