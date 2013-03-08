PACKAGE  = iris
NODEBIN  = ./node_modules/.bin
NODEUNIT = $(NODEBIN)/nodeunit
MOCHA    = $(NODEBIN)/mocha
RJS      = $(NODEBIN)/r.js
NPM      = npm
GIT      = git

MOCHAOPTS =
TESTDIR ?= test
BUILD   ?= ./dist/app.build.js
DISTLIB ?= ./dist/datavis.js
MINIFY  ?= 1

BUILDDIR = ./build

ifeq ($(MINIFY),0)
	RJSOPTS = "optimize=none"
endif

all: test

init-npm:
	@ $(NPM) install

init-submodules:
	@ $(GIT) submodule update --init

init: init-npm init-submodule

dist: init
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)
	
build: init
	@ $(RJS) -o $(BUILD) \
		appDir=./public dir=$(BUILDDIR) baseUrl=js namespace=

test: init-npm
	@ $(MOCHA) $(MOCHAOPTS) test/client/iris/*.js

clean:
	rm -rf $(DISTLIB) $(BUILDDIR)
	
dist-clean: clean
	rm -rf node_modules/
	
.PHONY: test all dist