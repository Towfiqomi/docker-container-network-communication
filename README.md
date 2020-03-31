cloud-application
==============================================


**Running the Project**

To run the Gitlab CI and runner container you have to use the compose file in the root

`- docker-compose up -d --build`

Gitlab CI runs on the following URL:

http://localhost:8880

To register a runner use the following command,

`- docker exec -it <runner-container-name> bash`

In the bash use the following command,

```
- gitlab-runner register \
 --executor="docker" \
 --custom_build_dir-enabled="true" \
 --docker-image="docker/compose:1.21.2" \
 --url="http://gitlab:80" \
 --clone-url="http://gitlab:80" \
 --registration-token="token of the ci" \
 --description="docker-runner" \
 --tag-list="docker" \
 --run-untagged="true" \
 --locked="false" \
 --docker-network-mode="cloud-application_gitlabnetwork" \
 --docker-disable-cache="true" \
 --docker-privileged="true" \
 --cache-dir="/cache" \
 --builds-dir="/builds" \
 --docker-volumes="gitlab-runner-builds:/builds" \
 --docker-volumes="gitlab-runner-cache:/cache" \
 --docker-volumes="/var/run/docker.sock:/var/run/docker.sock"
```


*** Don't forget to add the token in --registration-token ***

To run the services please use the following command,

```
- cd components
- docker-compose up -d --build
```


To run the test cases,

```
- cd componets
- cd service1
- npm test
```


** I have developed the whole project in windows **

There is some things I would like to add that for POST /shutdown

I had to open tcp://localhost:2375 to communicate with Docker.
For shutting down the docker container I had to expose the port 2375 and add TCP protocol on that port.

```
const options = {
    protocol: 'tcp',
    host: '127.0.0.1',
    port: 2375,
 };
```
This code works perfectly on wondows.

But in linux this code will not work.

For that I have also added this chunk of code,

```
const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const docker = new Docker(socket);
```

I beleive this will work on linux. But if this doesn't please give me an email "towfiqul.alom@tuni.fi". I will fix it or recode this feature.