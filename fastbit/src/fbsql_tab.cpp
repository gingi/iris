#if defined(_WIN32) && defined(_MSC_VER)
#pragma warning(disable:4786)	// some identifier longer than 256 characters
#endif
#include "table.h"	// ibis::table
#include "resource.h"	// ibis::gParameters
#include "mensa.h"	// ibis::mensa::select2
#include <set>		// std::set
#include <iomanip>	// std::setprecision


// local data types
typedef std::set< const char*, ibis::lessi > qList;

// printout the usage string
static void usage(const char* name) {
  std::cout << "usage:\n" << name << std::endl
	    << "[-d directory_containing_a_dataset] " << std::endl
	    << "[-s select string]" << std::endl
	    << "[-w where-clause]" << std::endl
		<< "[-o orderby]" << std::endl;
} // usage

// function to parse the command line arguments
static void parse_args(int argc, char** argv, ibis::table*& tbl,
		       const char*& qcnd, const char*& sel, const char*& orderby) {
  
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
      case 's':
	if (i+1 < argc) {
	  ++i;
	  sel = argv[i];
	}
	break;
      case 'q':
      case 'Q':
      case 'w':
      case 'W':
	if (i+1 < argc) {
	  ++ i;
	  qcnd = argv[i];
	}
	break;
      case 'o':
      case 'O':
	if (i+1 < argc) {
	  ++ i;
	  orderby = argv[i];
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

    const char* qcnd=0;
    const char* sel;
		const char* orderby=0;
    parse_args(argc, argv, tbl, qcnd, sel, orderby);
    if (tbl == 0) {
	std::clog << *argv << " must have at least one data table."
		  << std::endl;
	exit(-1);
    }

	if ((qcnd == 0 || *qcnd == 0)) {
		qcnd = "1=1";
	}
    ibis::table *res = tbl->select(sel,qcnd);;
    
		if (!(orderby==0 || *orderby == 0))
			res->orderby(orderby);
		
		res->dump(std::cout, "\t");

    delete res;
    delete tbl;
    return 0;
} // main
