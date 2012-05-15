TARGET ?= /kb/deployment
SERVICE = widget_lib
SERVICE_DIR = $(TARGET)/services/$(SERVICE)

all: deploy

deploy: deploy-services

deploy-services:
	./scripts/iris install node
	./scripts/iris install jquery
	cp -r . $(SERVICE_DIR)/
	echo '#!/bin/sh\niris start\n' > $(SERVICE_DIR)/start_service
	echo '#!/bin/sh\niris stop\n' > $(SERVICE_DIR)/stop_service	