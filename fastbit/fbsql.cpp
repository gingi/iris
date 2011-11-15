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

static void clearBuffers(const ibis::table::typeList& tps,
			 std::vector<void*>& buffers) {
    const size_t nc = (tps.size() <= buffers.size() ?
		       tps.size() : buffers.size());
    for (size_t j = 0; j < nc; ++ j) {
	switch (tps[j]) {
	case ibis::BYTE: {
	    signed char* tmp = static_cast<signed char*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::UBYTE: {
	    unsigned char* tmp = static_cast<unsigned char*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::SHORT: {
	    int16_t* tmp = static_cast<int16_t*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::USHORT: {
	    uint16_t* tmp = static_cast<uint16_t*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::INT: {
	    int32_t* tmp = static_cast<int32_t*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::UINT: {
	    uint32_t* tmp = static_cast<uint32_t*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::LONG: {
	    int64_t* tmp = static_cast<int64_t*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::ULONG: {
	    uint64_t* tmp = static_cast<uint64_t*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::FLOAT: {
	    float* tmp = static_cast<float*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::DOUBLE: {
	    double* tmp = static_cast<double*>(buffers[j]);
	    delete [] tmp;
	    break;}
	case ibis::TEXT:
	case ibis::CATEGORY: {
		std::vector<std::string>* tmp =
		    static_cast<std::vector<std::string>*>(buffers[j]);
		delete tmp;
		break;}
	default: {
	    break;}
	}
    }
} // clearBuffers

static void dumpIth(size_t i, ibis::TYPE_T t, void* buf) {
    switch (t) {
    case ibis::BYTE: {
	const signed char* tmp = static_cast<const signed char*>(buf);
	std::cout << (int)tmp[i];
	break;}
    case ibis::UBYTE: {
	const unsigned char* tmp = static_cast<const unsigned char*>(buf);
	std::cout << (unsigned)tmp[i];
	break;}
    case ibis::SHORT: {
	const int16_t* tmp = static_cast<const int16_t*>(buf);
	std::cout << tmp[i];
	break;}
    case ibis::USHORT: {
	const uint16_t* tmp = static_cast<const uint16_t*>(buf);
	std::cout << tmp[i];
	break;}
    case ibis::INT: {
	const int32_t* tmp = static_cast<const int32_t*>(buf);
	std::cout << tmp[i];
	break;}
    case ibis::UINT: {
	const uint32_t* tmp = static_cast<const uint32_t*>(buf);
	std::cout << tmp[i];
	break;}
    case ibis::LONG: {
	const int64_t* tmp = static_cast<const int64_t*>(buf);
	std::cout << tmp[i];
	break;}
    case ibis::ULONG: {
	const uint64_t* tmp = static_cast<const uint64_t*>(buf);
	std::cout << tmp[i];
	break;}
    case ibis::FLOAT: {
	const float* tmp = static_cast<const float*>(buf);
	std::cout << std::setprecision(7) << tmp[i];
	break;}
    case ibis::DOUBLE: {
	const double* tmp = static_cast<const double*>(buf);
	std::cout << std::setprecision(15) << tmp[i];
	break;}
    case ibis::TEXT:
    case ibis::CATEGORY: {
	const std::vector<std::string>* tmp =
	    static_cast<const std::vector<std::string>*>(buf);
	std::cout << '"' << (*tmp)[i] << '"';
	break;}
    default: {
	break;}
    }
} // dumpIth

// Print the first few rows of a table.  This is meant as an example that
// attempts to read all records into memory.  It is likely faster than
// funtion printValues, but it may be more likely to run out of memory.
static int printValues1(ibis::table*& tbl) {
 	if (ibis::gVerbose < 0) return 0;

 	const size_t nr = static_cast<size_t>(tbl->nRows());
  	if (nr != tbl->nRows()) {
		std::cout << "printValues is unlikely to be able to do it job "
	    	"because the number of rows (" << tbl->nRows()
		  << ") is too large for it read all records into memory"
		  << std::endl;
		return -1;
   }

   ibis::table::stringList nms = tbl->columnNames();
   ibis::table::typeList tps = tbl->columnTypes();
   std::vector<void*> buffers(nms.size(), 0);
   for (size_t i = 0; i < nms.size(); ++ i) {
		switch (tps[i]) {
			case ibis::BYTE: {
	    		char* buf = new char[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsBytes(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::UBYTE: {
    			unsigned char* buf = new unsigned char[nr];
    			if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
    			}
    			int64_t ierr = tbl->getColumnAsUBytes(nms[i], buf);
    			if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
    			}
    			buffers[i] = buf;
    			break;}
			case ibis::SHORT: {
  				int16_t* buf = new int16_t[nr];
   			if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
   			}
  				int64_t ierr = tbl->getColumnAsShorts(nms[i], buf);
  				if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
  				}
  				buffers[i] = buf;
  				break;}
			case ibis::USHORT: {
				uint16_t* buf = new uint16_t[nr];
    			if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsUShorts(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::INT: {
	    		int32_t* buf = new int32_t[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsInts(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::UINT: {
	    		uint32_t* buf = new uint32_t[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsUInts(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::LONG: {
	    		int64_t* buf = new int64_t[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsLongs(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::ULONG: {
	    		uint64_t* buf = new uint64_t[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsULongs(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::FLOAT: {
	    		float* buf = new float[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsFloats(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::DOUBLE: {
	    		double* buf = new double[nr];
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsDoubles(nms[i], buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			case ibis::TEXT:
			case ibis::CATEGORY: {
	    		std::vector<std::string>* buf = new std::vector<std::string>();
	    		if (buf == 0) { // run out of memory
					clearBuffers(tps, buffers);
					return -1;
	    		}
	    		int64_t ierr = tbl->getColumnAsStrings(nms[i], *buf);
	    		if (ierr < 0 || ((size_t) ierr) < nr) {
					clearBuffers(tps, buffers);
					return -2;
	    		}
	    		buffers[i] = buf;
	    		break;}
			default: break;
		}
	}
  	if (nms.size() != tbl->nColumns() || nms.size() == 0) return -3;

	printf("[");
   for (size_t i = 0; i < nr; ++ i) {
		if (i>0) std::cout << ",";
		std::cout << "[";
		dumpIth(i, tps[0], buffers[0]);
		for (size_t j = 1; j < nms.size(); ++ j) {
	    	std::cout << ",";
	    	dumpIth(i, tps[j], buffers[j]);
		}
		std::cout << "]";
   }
	printf("]");
   clearBuffers(tps, buffers);

   return 0;
} // printValues1

// This version uses ibis::cursor to print the first few rows.  It is
// likely to be slower than printValues1, but is likely to use less memory
// and less prone to failure.
static int printValues2(ibis::table*& tbl) {
	printf("[");
	ibis::table::cursor *cur = tbl->createCursor();
	if (cur == 0) return -1;
		uint64_t nr = tbl->nRows();
    	int ierr = 0;
    	for (size_t i = 0; i < nr; ++ i) {
			ierr = cur->fetch(); // make the next row ready
			if (ierr == 0) {
				if (i>0) printf(",");
				printf("[");
	    		cur->dump(std::cout, ",");
				printf("]");
			}
			else {
	    		std::cout << "printValues2 failed to fetch row " << i << std::endl;
	    		ierr = -2;
	    		break;
			}
    	}
    	delete cur; // clean up the cursor
		printf("]");

    	return ierr;
} // printValues2

static void printValues(ibis::table*& tbl) {
   if (tbl->nColumns() == 0 || tbl->nRows() == 0) return;
   int ierr = printValues1(tbl); // try to faster version first
   if (ierr < 0) { // try to the slower version
		ierr = printValues2(tbl);
		if (ierr < 0)
	    	std::cout << "printValues failed with error code " << ierr
		      	<< std::endl;
 	}
} // printValues


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

//	printf("Content-type: application/json\n\n");

	if ((qcnd == 0 || *qcnd == 0)) {
		qcnd = "1=1";
	}
   ibis::table *res = tbl->select(sel,qcnd);;
	if (!(orderby == 0 || *orderby == 0))
		res->orderby(orderby);
	printValues(res);
	delete res;
   delete tbl;
   return 0;
} // main
