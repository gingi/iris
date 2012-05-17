TARGET ?= /kb/deployment
SERVICE = widget_lib
SERVICE_DIR = $(TARGET)/services/$(SERVICE)
MONGO_DIR = $(SERVICE_DIR)/data/db

all: deploy

deploy: deploy-services

deploy-services:
	./scripts/iris install node
	./scripts/iris install jquery
	cp ./conf/services-sample.json ./conf/services.json
	echo '#!/bin/sh\n./scripts/iris start' > ./start_service
	echo 'mongod -dbpath $(MONGO_DIR)' >> ./start_service
	echo '#!/bin/sh\n./scripts/iris stop' > ./stop_service	
	echo 'killall mongod' >> ./stop_service
	chmod +x start_service stop_service
	mkdir -p $(SERVICE_DIR)
	mkdir -p $(MONGO_DIR)
	cp -r . $(SERVICE_DIR)/
	
	
