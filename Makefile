PACKAGE  = datavis
NODEUNIT = ./node_modules/nodeunit/bin/nodeunit
RJS      = ./node_modules/requirejs/bin/r.js
NPM      = npm
GIT      = git

TESTDIR ?= test
BUILD   ?= ./dist/app.build.js

all: test

init:
	@ $(NPM) install
	@ $(GIT) submodule update --init

dist: init
	@ $(RJS) -o $(BUILD)

test: init
	@ $(NODEUNIT) $(TESTDIR)

clean:
	rm -rf build/
	
dist-clean: clean
	rm -rf node_modules/
	
.PHONY: test all dist