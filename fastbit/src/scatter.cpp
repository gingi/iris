// $Id$
/// @author Andrew Olson <olson at cshl.edu>
/// @file
/// A simple test program for adaptive 2D histogram function.
/// 
#include <ibis.h>
#include <set>		// std::set
#include <iomanip>	// std::setprecision
#include <algorithm>
int debug=0;
ibis::table* tbl=0;

// printout the usage string
static void usage(const char* name) {
	std::cout << "usage:\n" << name
	      << "[-d directory containing a dataset]\n"
	      << "[-c1 column 1]\n"
	      << "[-c2 column 2]\n"
         << "[-b1 bins for c1]\n"
         << "[-b2 bins for c2]\n"
			<< "[-n1 min for c1]\n"
			<< "[-n2 min for c2]\n"
			<< "[-x1 max for c1]\n"
			<< "[-x2 max for c2]\n"
	      << "[-w where-clause]\n"
			<< "[-a adaptive binning]\n"
			<< "[-v verboseness]\n"
	      << std::endl;
} // usage

// function to parse the command line arguments
static void parse_args(int argc, char** argv,
	int* nbins1, int* nbins2, const char*& col1, const char*& col2, const char*& qcnd,
 	double* umin1, double* umax1, double* umin2, double* umax2, int* adaptive) {

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
				case 'v':
					if (i+1 < argc) {
						++ i;
						debug = 1;
					}
					break;
				case 'a':
					if (i+1 < argc) {
						++ i;
						*adaptive = 1;
					}
					break;
	    		case 'b':
					if (i+1 < argc) {
	    				if(argv[i][2] == '1') {
							++ i;
							*nbins1 = atoi(argv[i]);
	    				} else {
							++ i;
							*nbins2 = atoi(argv[i]);
	    				}
					}
					break;
	    		case 'c':
					if (i+1 < argc) {
		    			if(argv[i][2] == '1') {
							++ i;
							col1 = argv[i];
		    			} else {
							++ i;
							col2 = argv[i];
		    			}
					}
					break;
	    		case 'n':
					if (i+1 < argc) {
			    		if(argv[i][2] == '1') {
							++ i;
							*umin1 = atof(argv[i]);
			    		} else {
							++ i;
							*umin2 = atof(argv[i]);
			    		}
					}
					break;
			    case 'x':
					if (i+1 < argc) {
						if(argv[i][2] == '1') {
							++ i;
							*umax1 = atof(argv[i]);
						} else {
							++ i;
							*umax2 = atof(argv[i]);
						}
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
			} // switch (argv[i][1])
		} // normal arguments
	} // for (inti=1; ...)

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

std::vector<uint32_t> bincounts;

bool by_count (int a, int b) { return (bincounts[a] < bincounts[b]); }

static void uniform2DDist(const ibis::part*& part, const char *col1, double min1, double max1, uint32_t nb1,
 	const char *col2, double min2, double max2, uint32_t nb2, const char *qcnd) {

	// lookup type of col1 and type of col2
	const char* fmt_int = "%1.0f";
	const char* fmt_float = "%f";
	const char* f1;
	const char* f2;
	char format1[20];
	char format[20];
	switch (part->getColumn(col1)->type()) {
		case ibis::FLOAT:
		case ibis::DOUBLE: {
			f1 = fmt_float;
			break;
		}
		default: {
			f1 = fmt_int;
			break;
		}
	}
	switch (part->getColumn(col2)->type()) {
		case ibis::FLOAT:
		case ibis::DOUBLE: {
			f2 = fmt_float;
			break;
		}
		default: {
			f2 = fmt_int;
			break;
		}
	}
	sprintf(format1,"[%s,%s,%s]\n",f1,f2,"%d");
	sprintf(format,",[%s,%s,%s]\n",f1,f2,"%d");

	double stride1 = ibis::util::incrDouble((max1-min1)/nb1);
	double stride2 = ibis::util::incrDouble((max2-min2)/nb2);
   std::vector<uint32_t> cnts;

	long ierr;
	if (qcnd == 0 || *qcnd == 0) {
		ierr = part->get2DDistribution("1=1", col1, min1, max1, stride1, col2, min2, max2, stride2, cnts);
	} else {
		ierr = part->get2DDistribution(qcnd, col1, min1, max1, stride1, col2, min2, max2, stride2, cnts);
	}
   if (ierr < 0) {
		std::cerr << "ERROR -- part[" << part->name()
			       << "].get2DDistribution returned with ierr = " << ierr << std::endl
					<< "cnts.size() = " << cnts.size() << std::endl;
		exit(-1);
	}

	// success

	// count fully loaded bins
	std::vector<uint32_t> idx;
	bincounts.resize(cnts.size());
	uint32_t max_count=0;
	for (uint32_t i = 0; i < cnts.size(); ++ i) {
		idx.push_back(i);
		bincounts[i] = cnts[i];
		if (cnts[i] > max_count) {
			max_count = cnts[i];
		}
	}

	std::sort(idx.begin(), idx.end(), by_count);

	// cluster adjacent bins with similar density

	// start the JSON output
	printf("{\"max\":\"%d\",\"data\":[\n",max_count);

	// output occupied bins
	int first=1;
	for (uint32_t j = 0; j < idx.size(); ++ j) {
		uint32_t i = idx[j];
		if (cnts[i] > 0) {
			uint32_t i1 = i / nb2;
			uint32_t i2 = i % nb2;
			double x = i1*stride1 + min1 + 0.5*stride1;
			double y = i2*stride2 + min2 + 0.5*stride2;
			if (first == 1) {
				first = 0;
				printf(format1,x,y,cnts[i]);
			} else {
				printf(format,x,y,cnts[i]);
			}
		}
	}
	printf("]}\n");
}

static void adaptive2DDist(const ibis::part*& part, const char *col1, double min1, double max1, uint32_t nb1,
 	const char *col2, double min2, double max2, uint32_t nb2, const char *qcnd) {

	// lookup type of col1 and type of col2
	const char* fmt_int = "%1.0f";
	const char* fmt_float = "%f";
	const char* f1;
	const char* f2;
	char format1[20];
	char format[20];
	switch (part->getColumn(col1)->type()) {
		case ibis::FLOAT:
		case ibis::DOUBLE: {
			f1 = fmt_float;
			break;
		}
		default: {
			f1 = fmt_int;
			break;
		}
	}
	switch (part->getColumn(col2)->type()) {
		case ibis::FLOAT:
		case ibis::DOUBLE: {
			f2 = fmt_float;
			break;
		}
		default: {
			f2 = fmt_int;
			break;
		}
	}
	sprintf(format1,"[%s,%s,%s,%s,%s]\n",f1,f1,f2,f2,"%d");
	sprintf(format,",[%s,%s,%s,%s,%s]\n",f1,f1,f2,f2,"%d");

	std::vector<double> bds1, bds2;
   std::vector<uint32_t> cnts;

	long ierr;
	if (qcnd == 0 || *qcnd == 0) {
		ierr = part->get2DDistribution(col1, col2, nb1, nb2, bds1, bds2, cnts);
	} else {
		ierr = part->get2DDistribution(qcnd, col1, col2, nb1, nb2, bds1, bds2, cnts);
	}
   if (ierr < 0) {
		std::cerr << "ERROR -- part[" << part->name()
			       << "].get2DDistribution returned with ierr = " << ierr << std::endl
					<< "cnts.size() = " << cnts.size() << std::endl;
		exit(-1);
	}

	// success
	const uint32_t nbin2 = bds2.size() - 1;
	
	// count fully loaded bins
	std::vector<uint32_t> idx;
	bincounts.resize(cnts.size());
	uint32_t max_count=0;
	for (uint32_t i = 0; i < cnts.size(); ++ i) {
		idx.push_back(i);
		bincounts[i] = cnts[i];
		if (cnts[i] > max_count) {
			max_count = cnts[i];
		}
	}

	std::sort(idx.begin(), idx.end(), by_count);

	// cluster adjacent bins with similar density

	// start the JSON output
	printf("{\"max\":\"%d\",\"data\":[\n",max_count);

	// output occupied bins
	int first=1;
	for (uint32_t j = 0; j < idx.size(); ++ j) {
		uint32_t i = idx[j];
		if (cnts[i] > 0) {
			uint32_t i1 = i / nbin2;
			uint32_t i2 = i % nbin2;
			if (first == 1) {
				first = 0;
				printf(format1,bds1[i1],bds1[i1+1],bds2[i2],bds2[i2+1],cnts[i]);
			} else {
				printf(format,bds1[i1],bds1[i1+1],bds2[i2],bds2[i2+1],cnts[i]);
			}
		}
	}
	printf("]}\n");
}

int main(int argc, char** argv) {
   const char* qcnd=0;
   const char* col1;
   const char* col2;
   int nbins1=25;
	int nbins2=25;
	double min1,max1,min2,max2;
	int adaptive = 0;
   parse_args(argc, argv, &nbins1, &nbins2, col1, col2, qcnd, &min1, &max1, &min2, &max2, &adaptive);
	std::vector<const ibis::part*> parts;
	tbl->getPartitions(parts);
	if (adaptive == 1)
		adaptive2DDist(parts[0],col1,min1,max1,nbins1,col2,min2,max2,nbins2,qcnd);
	else
		uniform2DDist(parts[0],col1,min1,max1,nbins1,col2,min2,max2,nbins2,qcnd);
	delete tbl;
   return 0;
} // main
