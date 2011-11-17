CC = g++
DEBUG = -g
CFLAGS = -Wall -c $(DEBUG)
LFLAGS = -Wall $(DEBUG) -lfastbit -lm

all : scatter fbsql join_once

clean :
	rm scatter.o scatter fbsql.o fbsql join_once.o join_once

scatter : scatter.o
	$(CC) $(LFLAGS) scatter.o -o scatter

scatter.o : scatter.cpp
	$(CC) $(CFLAGS) scatter.cpp

fbsql : fbsql.o
	$(CC) $(LFLAGS) fbsql.o -o fbsql
	
fbsql.o : fbsql.cpp
	$(CC) $(CFLAGS) fbsql.cpp

join_once : join_once.o
	$(CC) $(LFLAGS) join_once.o -o join_once

join_once.o : join_once.cpp
	$(CC) $(CFLAGS) join_once.cpp
