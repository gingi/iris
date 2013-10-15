PACKAGE  = iris
NODEBIN  = ./node_modules/.bin
MOCHA    = $(NODEBIN)/mocha
RJS      = $(NODEBIN)/r.js
NPM      = npm
GIT      = git

JSDUCK  := $(shell which jsduck)

DOCROOT  = ./public
DISTDIR   = ./dist
MOCHAOPTS ?= 
APIDOC  = $(DISTDIR)/doc/api
TESTDIR ?= test
BUILD   ?= $(DISTDIR)/app.build.js
DISTLIB ?= $(DISTDIR)/iris.js
DISTCSS ?= $(DISTDIR)/iris.css
MINIFY  ?= 1

BUILDDIR = ./build
SOURCES  = $(shell find $(DOCROOT)/js -name "*.js")
CSS_SOURCES = $(shell find $(DOCROOT)/css -name "*.css")

ifeq ($(MINIFY),0)
	RJSOPTS = "optimize=none"
endif

all: test dist docs

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
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)\

$(APIDOC)/index.html: $(SOURCES)
ifndef JSDUCK
	$(error JSDuck not found (install with `gem install jsduck`).)
endif
	@ $(JSDUCK) --builtin-classes --output $(APIDOC) \
		--exclude $(DOCROOT)/js/d3.js \
		--exclude $(DOCROOT)/js/bootstrap.js \
		--exclude $(DOCROOT)/js/require.js \
		--exclude $(DOCROOT)/js/jquery.js \
		--exclude $(DOCROOT)/js/jquery-ui.js \
		--exclude $(DOCROOT)/js/jquery.dataTables.js \
		--exclude $(DOCROOT)/js/lib \
		--exclude $(DOCROOT)/js/renderers/old \
		--exclude $(DOCROOT)/js/widgets/old \
		-- $(DOCROOT)/js


dist: init $(DISTLIB) $(DISTCSS)

build: init
	@ $(RJS) -o $(BUILD) \
		appDir=./public dir=$(BUILDDIR) baseUrl=js namespace=

test: init
	@ $(MOCHA) $(MOCHAOPTS) test/client/*/*.js test/universal/*.js

docs: init $(APIDOC)/index.html

clean:
	rm -rf $(DISTLIB) $(BUILDDIR) $(APIDOC)

dist-clean: clean
	rm -rf node_modules/

.PHONY: test all dist