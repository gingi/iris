PACKAGE  = datavis
NODEUNIT = ./node_modules/nodeunit/bin/nodeunit
RJS      = ./node_modules/requirejs/bin/r.js
NPM      = npm
GIT      = git

TESTDIR ?= test
BUILD   ?= ./dist/app.build.js
DISTLIB ?= ./dist/datavis.js
MINIFY  ?= 1

BUILDDIR = ./build

ifeq ($(MINIFY),0)
	RJSOPTS = "optimize=none"
endif

all: test

init:
	@ $(NPM) install
	@ $(GIT) submodule update --init

dist: init
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)
	
build: init
	@ $(RJS) -o $(BUILD) \
		appDir=./public dir=$(BUILDDIR) baseUrl=js namespace=

test: init
	@ $(NODEUNIT) $(TESTDIR)

clean:
	rm -rf $(DISTLIB) $(BUILDDIR)
	
dist-clean: clean
	rm -rf node_modules/
	
.PHONY: test all dist