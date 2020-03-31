gitlab-runner register \
--executor="docker" \
--custom_build_dir-enabled="true" \
--docker-image="docker/compose:1.21.2" \
--url="http://gitlab:80" \
--clone-url="http://gitlab:80" \
--registration-token="8-yg88sxbnWejZwxvVeJ" \
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

