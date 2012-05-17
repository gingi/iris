TARGET ?= /kb/deployment
SERVICE = widget_lib
SERVICE_DIR = $(TARGET)/services/$(SERVICE)
MONGO_DIR = $(SERVICE_DIR)/data/db

all: deploy

deploy: deploy-services populate-mongo

deploy-services:
	./scripts/iris install node
	./scripts/iris install jquery
	cp ./conf/services-sample.json ./conf/services.json
	echo '#!/bin/sh\n$(SERVICE_DIR)/scripts/iris start' > ./start_service
	echo 'nohup mongod -dbpath $(MONGO_DIR) &' >> ./start_service
	echo '#!/bin/sh\n$(SERVICE_DIR)/scripts/iris stop' > ./stop_service	
	echo 'killall mongod' >> ./stop_service
	chmod +x start_service stop_service
	mkdir -p $(SERVICE_DIR)
	mkdir -p $(MONGO_DIR)
	cp -r . $(SERVICE_DIR)/
	echo "OK ... Done Deploying Services."


populate-mongo: deploy-services
	nohup mongod -dbpath $(MONGO_DIR) &
	sleep 5
	./scripts/iris examples
	killall mongod
	echo "OK ... Done Populating Mongo."
