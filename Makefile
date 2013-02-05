PACKAGE  = datavis
NODEUNIT = ./node_modules/nodeunit/bin/nodeunit
RJS      = ./node_modules/requirejs/bin/r.js
BUILD   ?= ./dist/app.build.js

TESTDIR ?= test

all: test

dist:
	@ $(RJS) -o $(BUILD)

test:
	@ $(NODEUNIT) $(TESTDIR)

clean:
	rm -rf build/
	
.PHONY: test all dist