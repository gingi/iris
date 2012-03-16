#if defined(_WIN32) && defined(_MSC_VER)
#pragma warning(disable:4786)	// some identifier longer than 256 characters
#endif
#include "table.h"	// ibis::table
#include "resource.h"	// ibis::gParameters
#include "mensa.h"	// ibis::mensa::select2
#include <set>		// std::set
#include <iomanip>	// std::setprecision
#include <qExpr.h>

// local data types
typedef std::set< const char*, ibis::lessi > qList;

// printout the usage string
static void usage(const char* name) {
  std::cout << "usage:\n" << name << std::endl
	    << "[-d1 first dataset] " << std::endl
	    << "[-d2 second dataset] " << std::endl
	    << "[-s1 first select string (first column matches -j argument)]" << std::endl
	    << "[-s2 second select string]" << std::endl
	    << "[-w1 first where-clause]" << std::endl
	    << "[-w2 second where-clause]" << std::endl
		<< "[-j column from second table to join on]" << std::endl;
} // usage

// function to parse the command line arguments
static void parse_args(int argc, char** argv, ibis::table*& tbl1, ibis::table*& tbl2,
		       	const char*& qcnd1, const char*& qcnd2, const char*& sel1, const char*& sel2, const char*& jcol) {
  
	std::vector<const char*> dirs1;
	std::vector<const char*> dirs2;

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
	    				if(argv[i][2] == '1') {
							++ i;
							dirs1.push_back(argv[i]);
	    				} else {
							++ i;
							dirs2.push_back(argv[i]);
	    				}
					}
					break;
      		case 's':
					if (i+1 < argc) {
						if(argv[i][2] == '1') {
							++ i;
							sel1 = argv[i];
						} else {
							++ i;
							sel2 = argv[i];
						}
					}
					break;
      		case 'w':
					if (i+1 < argc) {
						if(argv[i][2] == '1') {
							++ i;
							qcnd1 = argv[i];
						} else {
							++ i;
							qcnd2 = argv[i];
						}
					}
					break;
				case 'j':
					if (i+1 < argc) {
						++ i;
						jcol = argv[i];
					}
					break;
			} // switch (argv[i][1])
		} // normal arguments
	} // for (inti=1; ...)

    // add the data partitions from configuartion files first
	tbl1 = ibis::table::create(0);
	tbl2 = ibis::table::create(0);
	// add data partitions from explicitly specified directories
	for (std::vector<const char*>::const_iterator it = dirs1.begin();
       it != dirs1.end(); ++ it) {
   		if (tbl1 != 0)
      		tbl1->addPartition(*it);
    		else
      		tbl1 = ibis::table::create(*it);
  	}
	if (tbl1 == 0) {
		usage(argv[0]);
		exit(-2);
	}
	for (std::vector<const char*>::const_iterator it = dirs2.begin();
       it != dirs2.end(); ++ it) {
   		if (tbl2 != 0)
      		tbl2->addPartition(*it);
    		else
      		tbl2 = ibis::table::create(*it);
  	}
	if (tbl2 == 0) {
		usage(argv[0]);
		exit(-2);
	}
} // parse_args

int main(int argc, char** argv) {
   ibis::table* tbl1 = 0;
   const char* qcnd1=0;
   const char* sel1;
   ibis::table* tbl2 = 0;
   const char* qcnd2=0;
   const char* sel2;
	const char* jcol;
	parse_args(argc, argv, tbl1, tbl2, qcnd1, qcnd2, sel1, sel2, jcol);

	if ((qcnd1 == 0 || *qcnd1 == 0)) {
		qcnd1 = "1=1";
	}
   ibis::table *res1 = tbl1->select(sel1,qcnd1);;
	delete tbl1;
	
	// get the first column from res1
   ibis::table::stringList nms = res1->columnNames();
   ibis::table::typeList tps = res1->columnTypes();
	if (tps[0] != ibis::UINT) {
		usage(argv[0]);
		exit(-2);
	}
	
	const size_t nr = static_cast<size_t>(res1->nRows());
	ibis::array_t<uint32_t> arr(nr);
	int64_t ierr = res1->getColumnAsUInts(nms[0], arr.begin());
	if (ierr < 0 || ((size_t) ierr) < nr) {
		std::cerr << "error fetching " << nms[0] << std::endl;
		return -2;
	}
	delete res1;
	
	// query the second table
	ibis::qExpr* qexpr = new ibis::qDiscreteRange(jcol, arr);
	ibis::table *res2 = tbl2->select(sel2,qexpr);
   delete tbl2;
   res2->dump(std::cout, "JSON");
	delete res2;
   return 0;
} // main
