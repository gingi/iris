PACKAGE  = iris
NODEBIN  = ./node_modules/.bin
MOCHA    = $(NODEBIN)/mocha
JSDOC    = ./external/jsdoc/jsdoc
RJS      = $(NODEBIN)/r.js
NPM      = npm
GIT      = git

MOCHAOPTS =
JSDOCCONF = ./conf/jsdoc.json
JSDOCDEST = ./dist/doc/api
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

docs:
	@ $(JSDOC) --configure $(JSDOCCONF) --destination $(JSDOCDEST)

dist: init docs
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)
	
build: init
	@ $(RJS) -o $(BUILD) \
		appDir=./public dir=$(BUILDDIR) baseUrl=js namespace=

test: init-npm
	@ $(MOCHA) $(MOCHAOPTS) test/client/*/*.js test/universal/*.js

clean:
	rm -rf $(DISTLIB) $(BUILDDIR) $(JSDOCDEST)
	
dist-clean: clean
	rm -rf node_modules/
	
.PHONY: test all dist