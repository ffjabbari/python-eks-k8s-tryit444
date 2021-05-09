
# A series of commands for developing the BFF, Breaker, and Service containers individually


# 1. Build your image:

docker build --tag book_service:1.0 .
docker build --tag customer_service:1.0 .

docker build --tag book_bff:1.0 .
docker build --tag customer_bff:1.0 .

docker build --tag rec_breaker:1.0 .

# 2. a) Either run the container locally…

docker container run -d -p 3002:3000 book_service:1.0
docker container run -d -p 3001:3000 customer_service:1.0 
docker container run -d -p 82:80 book_bff:1.0 
docker container run -d -p 81:80 customer_bff:1.0 
docker container run -d -p 83:80 customer_bff:1.0 

# User sudo in Vagrant: 
# sudo docker container run -d -p 3001:3000 fibdocker/customer_service:1.0 
# sudo docker container run -d -p 3002:3000 fibdocker/book_service:1.0
# sudo docker container run -d -p 81:80 fibdocker/customer_bff:1.0 
# sudo docker container run -d -p 82:80 fib docker/book_bff:1.0 
# sudo docker container run -d -p 83:80 fibdocker/rec_breaker:1.0 

# 2. b) OR tag it for Deployment

docker tag ? fibdocker/book_bff:1.0
docker tag ? fibdocker/customer_bff:1.0

docker tag ? fibdocker/book_service:1.0
docker tag ? fibdocker/customer_service:1.0

docker tag ? fibdocker/rec_breaker:1.0

# 2. c) and push to docker HUB

docker push fibdocker/rec_breaker:1.0
docker push fibdocker/book_bff:1.0
docker push fibdocker/customer_service:1.0
docker push fibdocker/book_service:1.0
docker push fibdocker/rec_breaker:1.0

# 3. Restart k8s cluster to see changes

kubectl rollout restart deployment book-bff -n book-app
