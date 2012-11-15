PACKAGE  = datavis
NODEUNIT = ./node_modules/nodeunit/bin/nodeunit

TESTDIR ?= test

all: test

test:
	$(NODEUNIT) $(TESTDIR)
	
.PHONY: test all