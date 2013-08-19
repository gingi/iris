PACKAGE  = iris
NODEBIN  = ./node_modules/.bin
MOCHA    = $(NODEBIN)/mocha
YDOC     = $(NODEBIN)/yuidoc
RJS      = $(NODEBIN)/r.js
NPM      = npm
GIT      = git

DISTDIR   = ./dist
MOCHAOPTS =
YDOCCONF = ./conf/yuidoc.json
DOCDEST = $(DISTDIR)/doc/api
TESTDIR ?= test
BUILD   ?= $(DISTDIR)/app.build.js
DISTLIB ?= $(DISTDIR)/iris.js
DISTCSS ?= $(DISTDIR)/iris.css
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

init: init-npm init-submodules

docs:
	@ $(YDOC) --config $(YDOCCONF) --outdir $(DOCDEST)
	@ echo "Documentation written to $(DOCDEST)"

dist: init docs
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)
	@ $(RJS) -o out=$(DISTCSS) cssIn=public/css/iris.css $(RJSOPTS)

build: init
	@ $(RJS) -o $(BUILD) \
		appDir=./public dir=$(BUILDDIR) baseUrl=js namespace=

test:
	@ $(MOCHA) $(MOCHAOPTS) test/client/*/*.js test/universal/*.js

clean:
	rm -rf $(DISTLIB) $(BUILDDIR) $(DOCDEST)

dist-clean: clean
	rm -rf node_modules/

.PHONY: test all dist