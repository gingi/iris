TARGET ?= /kb/deployment
SERVICE = widget_lib
SERVICE_DIR = $(TARGET)/services/$(SERVICE)

all: deploy

deploy: deploy-services

deploy-services:
	./scripts/iris install node
	./scripts/iris install jquery
	cp -r . $(SERVICE_DIR)/
	echo '#!/bin/sh\n./scripts/iris start' > $(SERVICE_DIR)/start_service
	echo '#!/bin/sh\n./scripts/iris stop' > $(SERVICE_DIR)/stop_service	