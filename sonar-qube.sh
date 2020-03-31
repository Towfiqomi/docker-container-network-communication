docker run -d --name sonarqube \
  -p 9000:9000 \
  -v $SONARQUBE_HOME/conf:/opt/sonarqube/conf \
  -v $SONARQUBE_HOME/extensions:/opt/sonarqube/extensions \
  -v $SONARQUBE_HOME/logs:/opt/sonarqube/logs \
  -v $SONARQUBE_HOME/data:/opt/sonarqube/data \
  sonarqube