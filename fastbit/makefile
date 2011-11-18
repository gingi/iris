CC = g++
DEBUG = -g
CFLAGS = -Wall -c $(DEBUG)
LFLAGS = -Wall $(DEBUG) -lfastbit -lm

all : scatter fbsql join_once scatter_new

clean :
	rm scatter.o scatter fbsql.o fbsql join_once.o join_once

scatter : scatter.o
	$(CC) $(LFLAGS) scatter.o -o scatter

scatter.o : scatter.cpp
	$(CC) $(CFLAGS) scatter.cpp

scatter_new : scatter_new.o
	$(CC) $(LFLAGS) scatter_new.o -o scatter_new

scatter_new.o : scatter_new.cpp
	$(CC) $(CFLAGS) scatter_new.cpp

fbsql : fbsql.o
	$(CC) $(LFLAGS) fbsql.o -o fbsql
	
fbsql.o : fbsql.cpp
	$(CC) $(CFLAGS) fbsql.cpp

join_once : join_once.o
	$(CC) $(LFLAGS) join_once.o -o join_once

join_once.o : join_once.cpp
	$(CC) $(CFLAGS) join_once.cpp

gwas2go : gwas2go.o
	$(CC) $(LFLAGS) gwas2go.o -o gwas2go

gwas2go.o : gwas2go.cpp
	$(CC) $(CFLAGS) gwas2go.cpp
