#if defined(_WIN32) && defined(_MSC_VER)
#pragma warning(disable:4786)	// some identifier longer than 256 characters
#endif
#include "table.h"	// ibis::table
#include "part.h"
#include "resource.h"	// ibis::gParameters
#include "mensa.h"	// ibis::mensa::select2
#include <set>		// std::set
#include <iomanip>	// std::setprecision


// local data types
typedef std::set< const char*, ibis::lessi > qList;

// printout the usage string
static void usage(const char* name) {
  std::cout << "usage:\n" << name << std::endl
	<< "[-d directory_containing_a_dataset] " << std::endl;
} // usage

// function to parse the command line arguments
static void parse_args(int argc, char** argv, ibis::table*& tbl) {
  
  std::vector<const char*> dirs;

  for (int i=1; i<argc; ++i) {
    if (*argv[i] == '-') { // normal arguments starting with -
      switch (argv[i][1]) {
      	default:
      	case 'h':
      	case 'H':
			usage(*argv);
			exit(0);
      	case 'd':
      	case 'D':
			if (i+1 < argc) {
	  			++ i;
	  			dirs.push_back(argv[i]);
			}
			break;
     	} // switch (argv[i][1])
     } // normal arguments
	} // for (inti=1; ...)

    // add the data partitions from configuartion files first
  tbl = ibis::table::create(0);
  // add data partitions from explicitly specified directories
  for (std::vector<const char*>::const_iterator it = dirs.begin();
       it != dirs.end(); ++ it) {
    if (tbl != 0)
      tbl->addPartition(*it);
    else
      tbl = ibis::table::create(*it);
  }
  if (tbl == 0) {
    usage(argv[0]);
    exit(-2);
  }
} // parse_args

int main(int argc, char** argv) {
   ibis::table* tbl = 0;

   parse_args(argc, argv, tbl);
   if (tbl == 0) {
		std::clog << *argv << " must have at least one data table."
		  << std::endl;
		exit(-1);
   }


	std::vector<const ibis::part*> parts;
	tbl->getPartitions(parts);
	// iterate over the tbl columns and types
	// output the min and max values for each numerical column
	ibis::table::typeList tps = tbl->columnTypes();
	ibis::table::stringList nms = tbl->columnNames();
	int first = 1;
	printf("[");
	for (size_t i = 0; i < nms.size(); ++ i) {
		ibis::column* col = parts[0]->getColumn(i);
		switch (tps[i]) {
			case ibis::DOUBLE:
			case ibis::FLOAT: {
	//			std::cerr << "nms[" << i << "] = " << nms[i] << std::endl;
				double min = col->getActualMin();
				double max = col->getActualMax();
				if (first == 1) {
					printf("[\"%s\",%f,%f]\n",nms[i],min,max);
					first = 0;
				} else {
					printf(",[\"%s\",%f,%f]\n",nms[i],min,max);
				}
			}
			break;
			case ibis::BYTE:
			case ibis::UBYTE:
			case ibis::SHORT:
			case ibis::USHORT:
			case ibis::INT:
			case ibis::UINT:
			case ibis::LONG:
			case ibis::ULONG: {
				double min = col->getActualMin();
				double max = col->getActualMax();
				if (first == 1) {
					printf("[\"%s\",%1.0f,%1.0f]\n",nms[i],min,max);
					first = 0;
				} else {
					printf(",[\"%s\",%1.0f,%1.0f]\n",nms[i],min,max);
				}
			}
			default: break;
		}
	}
	printf("]\n");
   delete tbl;
   return 0;
} // main
