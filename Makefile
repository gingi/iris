PACKAGE  = iris
NODEBIN  = ./node_modules/.bin
MOCHA    = $(NODEBIN)/mocha
RJS      = $(NODEBIN)/r.js
UGLIFY   = $(NODEBIN)/uglifyjs
NPM      = npm
GIT      = git

JSDUCK  := $(shell which jsduck)

DOCROOT     = ./public
DISTDIR    ?= ./dist
MOCHAOPTS  ?= 
APIDOC      = $(DISTDIR)/doc/api
TESTDIR    ?= ./test
BUILDJS    ?= ./dist/app.build.js
BUILDCSS   ?= ./dist/app.build.css
DISTLIB    ?= $(DISTDIR)/iris.js
MINDISTLIB ?= $(DISTDIR)/iris.min.js
DISTCSS    ?= $(DISTDIR)/iris.css
MINDISTCSS ?= $(DISTDIR)/iris.min.css

BUILDDIR    = ./build
SOURCES     = $(shell find $(DOCROOT)/js -name "*.js")
CSSFILES    = $(shell find $(DOCROOT)/css -name "*.css")
LESSFILES   = $(shell find $(DOCROOT)/less -name "*.less")
IRISCSS     = ./public/css/iris.css
IRISLESS    = ./public/less/iris.less

PREAMBLE = $(shell node ./dist/preamble.js)

add-preamble = \
	node ./dist/preamble.js > tmpfile.preamb; \
	cat "$(1)" >> tmpfile.preamb; \
	mv tmpfile.preamb $(1);

RJSOPTS=

all: test dist docs

node_modules:
	@ $(NPM) install

init-npm: node_modules

init-submodules:
	@ $(GIT) submodule update --init

init: init-npm init-submodules
	
$(IRISCSS): $(LESSFILES)
	@ lessc --compress --clean-css -O2 $(IRISLESS) $(IRISCSS)

$(DISTCSS): $(CSSFILES) $(BUILDCSS) $(IRISCSS)
	@ $(RJS) -o out=$(DISTCSS) cssIn=$(BUILDCSS) $(RJSOPTS) optimize=none
	@ perl -pi -e 's|\.\./public|..|g' $(DISTCSS)
	@ $(call add-preamble,$(DISTCSS))

$(MINDISTCSS): $(CSSFILES) $(BUILDCSS)
	@ $(RJS) -o out=$(MINDISTCSS) cssIn=$(BUILDCSS) $(RJSOPTS) \
		optimizeCss=standard
	@ perl -pi -e 's|\.\./public|..|g' $(MINDISTCSS)
	@ $(call add-preamble,$(MINDISTCSS))

$(DISTLIB): $(SOURCES) $(BUILDJS)
	@ $(RJS) -o $(BUILDJS) out=$(DISTLIB) $(RJSOPTS)
	@ $(call add-preamble,$(DISTLIB))

$(MINDISTLIB): $(DISTLIB)
	@ $(UGLIFY) $(DISTLIB) --comments --compress --mangle --output $(MINDISTLIB)

$(APIDOC)/index.html: $(SOURCES)
ifndef JSDUCK
	$(error JSDuck not found (install with `gem install jsduck`).)
endif
	@ $(JSDUCK) --builtin-classes --output $(APIDOC) \
		--exclude $(DOCROOT)/js/require.js \
		--exclude $(DOCROOT)/js/text.js \
		--exclude $(DOCROOT)/js/lib \
		--exclude $(DOCROOT)/js/util/spin.js \
		--exclude $(DOCROOT)/js/renderers/old \
		--exclude $(DOCROOT)/js/widgets/old \
		-- $(DOCROOT)/js

dist: init $(DISTLIB) $(MINDISTLIB) $(DISTCSS) $(MINDISTCSS)

build: init $(SOURCES) $(IRISCSS)
	@ $(RJS) -o $(BUILDJS) \
		appDir=./public dir=$(BUILDDIR) optimizeCss=none baseUrl=js namespace= \
		name=iris-bundle optimize=uglify

test: init
	@ $(MOCHA) $(MOCHAOPTS) test/*/*.js
	
test-dist: $(DISTLIB)
	@ $(NODEBIN)/mocha-phantomjs test/test-dist.html

docs: init $(APIDOC)/index.html

clean:
	rm -rf $(DISTLIB) $(DISTCSS) $(MINDISTLIB) $(MINDISTCSS) $(BUILDDIR) $(APIDOC) $(IRISCSS)

distclean: clean
	rm -rf node_modules/

.PHONY: test all dist