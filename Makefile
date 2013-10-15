PACKAGE  = iris
NODEBIN  = ./node_modules/.bin
MOCHA    = $(NODEBIN)/mocha
YDOC     = $(NODEBIN)/yuidoc
RJS      = $(NODEBIN)/r.js
NPM      = npm
GIT      = git

DOCSROOT  = ./public
DISTDIR   = ./dist
MOCHAOPTS ?= 
YDOCCONF = ./conf/yuidoc.json
DOCDEST = $(DISTDIR)/doc/api
TESTDIR ?= test
BUILD   ?= $(DISTDIR)/app.build.js
DISTLIB ?= $(DISTDIR)/iris.js
DISTCSS ?= $(DISTDIR)/iris.css
MINIFY  ?= 1

BUILDDIR = ./build
SOURCES  = $(shell find $(DOCSROOT)/js -name "*.js")
CSS_SOURCES = $(shell find $(DOCSROOT)/css -name "*.css")

ifeq ($(MINIFY),0)
	RJSOPTS = "optimize=none"
endif

all: test

node_modules:
	@ $(NPM) install

init-npm: node_modules

init-submodules:
	@ $(GIT) submodule update --init

init: init-npm init-submodules

$(DISTCSS): $(CSS_SOURCES)
	@ $(RJS) -o out=$(DISTCSS) cssIn=dist/app.build.css $(RJSOPTS)
	@ perl -pi -e 's|\.\./public|..|g' $(DISTCSS)

$(DISTLIB): $(SOURCES) $(BUILD)
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)

dist: init $(DISTLIB) $(DISTCSS)

build: init
	@ $(RJS) -o $(BUILD) \
		appDir=./public dir=$(BUILDDIR) baseUrl=js namespace=

test: init
	@ $(MOCHA) $(MOCHAOPTS) test/client/*/*.js test/universal/*.js

clean:
	rm -rf $(DISTLIB) $(BUILDDIR) $(DOCDEST)

dist-clean: clean
	rm -rf node_modules/

.PHONY: test all dist