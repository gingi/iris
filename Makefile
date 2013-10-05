PACKAGE  = datavis
NODEUNIT = ./node_modules/nodeunit/bin/nodeunit
RJS      = ./node_modules/requirejs/bin/r.js
NPM      = npm
GIT      = git

JSDIR    = public/js
TESTDIR  = test
BUILD   ?= ./dist/app.build.js
DISTLIB ?= ./dist/datavis.js
DISTCSS ?= ./dist/datavis.css
MINIFY  ?= 0

BUILDDIR = ./build
SOURCES  = $(shell find $(JSDIR) -name "*.js")
CSS_SOURCES = $(shell find public/css -name "*.css")

ifeq ($(MINIFY),0)	
	RJSOPTS = "optimize=none"
endif

all: test

init:
	@ $(NPM) install
	@ $(GIT) submodule update --init

$(DISTCSS): $(CSS_SOURCES)
	@ $(RJS) -o out=$(DISTCSS) cssIn=dist/app.build.css $(RJSOPTS)

$(DISTLIB): $(SOURCES) $(BUILD)
	@ $(RJS) -o $(BUILD) out=$(DISTLIB) $(RJSOPTS)

dist: init $(DISTLIB) $(DISTCSS)

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