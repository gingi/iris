CC = g++
DEBUG = -g
CFLAGS = -Wall -c $(DEBUG)
LFLAGS = -Wall $(DEBUG) -lfastbit -lm

all : scatter fbsql

clean :
	rm scatter.o scatter fbsql.o fbsql

scatter : scatter.o
	$(CC) $(LFLAGS) scatter.o -o scatter

scatter.o : scatter.cpp
	$(CC) $(CFLAGS) scatter.cpp

fbsql : fbsql.o
	$(CC) $(LFLAGS) fbsql.o -o fbsql
	
fbsql.o : fbsql.cpp
	$(CC) $(CFLAGS) fbsql.cpp

