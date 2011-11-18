// $Id$
/// @author Andrew Olson <olson at cshl.edu>
/// @file
/// A simple test program for adaptive 2D histogram function.
/// 
#include <ibis.h>
#include <set>		// std::set
#include <iomanip>	// std::setprecision
#include <algorithm>

// printout the usage string
static void usage(const char* name) {
	std::cout << "usage:\n" << name
	      << "[-d directory containing a dataset]\n"
	      << "[-c1 column 1]\n"
	      << "[-c2 column 2]\n"
         << "[-b1 bins for c1]\n"
         << "[-b2 bins for c2]\n"
			<< "[-f fudge factor (default: 1.0)]\n"
			<< "[-m maxbins cutoff (default: 10000)]\n"
			<< "[-n1 min for c1]\n"
			<< "[-n2 min for c2]\n"
			<< "[-x1 max for c1]\n"
			<< "[-x2 max for c2]\n"
	      << "[-w where-clause]\n"
	      << std::endl;
} // usage

// function to parse the command line arguments
//parse_args(argc, argv, tbl, &nbins1, &nbins2, col1, col2, qcnd, &fudge, &maxbins, &umin1, &umax1, &umin2, &umax2);
static void parse_args(int argc, char** argv, ibis::table*& tbl,
	int* nbins1, int* nbins2, const char*& col1, const char*& col2, const char*& qcnd,
	double* fudge, int* maxbins, double* umin1, double* umax1, double* umin2, double* umax2) {

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
				case 'f':
					if (i+1 < argc) {
						++ i;
						*fudge = atof(argv[i]);
					}
					break;
				case 'm':
					if (i+1 < argc) {
						++ i;
						*maxbins = atoi(argv[i]);
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

int first = 1;
double epsilon = 0.000001;

static void get2DDist(const ibis::part*& part, const char *col1, double min1, double max1, int nb1,
 	const char *col2, double min2, double max2, int nb2, const char *qcnd, uint32_t cutoff) {

	char combined_cond[200]="";
	if (qcnd == 0 || *qcnd == 0)
		sprintf(combined_cond, "1=1");
	else
		sprintf(combined_cond, "%s", qcnd);

//	printf("\n\nget2DDist(%s, %s, %f, %f, %d, %s, %f, %f, %d, %s, %d)\n\n", part->name(), col1, min1, max1, nb1, col2, min2, max2, nb2, qcnd, cutoff);

	double stride1 = ibis::util::incrDouble((max1-min1)/nb1);
	double stride2 = ibis::util::incrDouble((max2-min2)/nb2);
   std::vector<uint32_t> cnts;
	long ierr = part->get2DDistribution(combined_cond,
		col1, min1, max1, stride1,
		col2, min2, max2, stride2,
		cnts);
   if (ierr < 0) {
		std::cerr << "Warning -- part[" << part->name()
			       << "].get2DDistribution returned with ierr = " << ierr << std::endl
					<< "cnts.size() = " << cnts.size() << std::endl;
		exit(-1);
	}
//	printf("min1 %f, max1 %f, stride1 %f\n",min1,max1,stride1);
//	printf("min2 %f, max2 %f, stride2 %f\n",min2,max2,stride2);
//	printf("nb1 %d, nb2 %d, cnts.size() %d\n",nb1,nb2,cnts.size());
	// success

	const char* fmt_int = "%1.0f";
	const char* fmt_float = "%f";
	const char* f1;
	const char* f2;

	// lookup type of col1 and type of col2
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
	
	for (uint32_t i = 0; i < cnts.size(); ++ i) {
		if (cnts[i] > 0) {
			
			// i == nb2 * i1 + i2
			
			uint32_t i1 = i / nb2;
			uint32_t i2 = i % nb2;
			double bmin1 = i1*stride1 + min1;
			double bmax1 = bmin1 + stride1;
			double bmin2 = i2*stride2 + min2;
			double bmax2 = bmin2 + stride2;
			if (cnts[i] < cutoff) {
				// call it again with modified min1,max1,min2,max2
				get2DDist(part,col1,bmin1,bmax1,nb1,col2,bmin2,bmax2,nb2,qcnd,0);
			} else {
				if (!first){
					printf(",");
				} else {
					first = 0;
				}
				printf("[");//%d,%d,%d,",i,i1,i2);
				printf(f1,bmin1);printf(",");
				printf(f1,bmax1);printf(",");
				printf(f2,bmin2);printf(",");
				printf(f2,bmax2);
				printf(",%d,0]\n",cnts[i]);
			}
		}
	}
}

double get_val(ibis::table::cursor*& cur, uint32_t offset, ibis::table::typeList tps) {
	double one = 1.0;
	uint32_t ierr;
	switch (tps[offset]) {
		case ibis::BYTE: {
			char val;
			ierr = cur->getColumnAsByte(offset, val);
			return val*one;
		}
		case ibis::UBYTE: {
			unsigned char val;
			ierr = cur->getColumnAsUByte(offset, val);
			return val*one;
		}
		case ibis::SHORT: {
			int16_t val;
			ierr = cur->getColumnAsShort(offset, val);
			return val*one;
		}
		case ibis::USHORT: {
			uint16_t val;
			ierr = cur->getColumnAsUShort(offset, val);
			return val*one;
		}
		case ibis::INT: {
			int32_t val;
			ierr = cur->getColumnAsInt(offset, val);
			return val*one;
		}
		case ibis::UINT: {
			uint32_t val;
			ierr = cur->getColumnAsUInt(offset, val);
			return val*one;
		}
		case ibis::LONG: {
			int64_t val;
			ierr = cur->getColumnAsLong(offset, val);
			return val*one;
		}
		case ibis::ULONG: {
			uint64_t val;
			ierr = cur->getColumnAsULong(offset, val);
			return val*one;
		}
		case ibis::FLOAT: {
			float val;
			ierr = cur->getColumnAsFloat(offset, val);
			return val*one;
		}
		case ibis::DOUBLE: {
			double val;
			ierr = cur->getColumnAsDouble(offset, val);
			return val*one;
		}
		default: break;
	}
	return 0;
}

void get_data(ibis::table* tbl, uint32_t *tally, double *area, double *min1, double *max1, double *min2, double *max2) {
	ibis::table::cursor *cur = tbl->createCursor();
	if (cur == 0) return;
	uint32_t ierr;
	ierr = cur->fetch();
	
	ibis::table::typeList tps = tbl->columnTypes();
	
	*min1 = get_val(cur,0,tps);
	*max1 = get_val(cur,1,tps);
	*min2 = get_val(cur,2,tps);
	*max2 = get_val(cur,3,tps);
	*area = (*max1-*min1)*(*max2-*min2);
	ierr = cur->getColumnAsUInt(4,*tally);
	delete cur;
}

int main(int argc, char** argv) {
	ibis::table* tbl=0;
   const char* qcnd=0;
   const char* col1;
   const char* col2;
   int nbins1=25;
	int nbins2=25;
	int maxbins = 10000;
	double fudge = 1.0;
	double umin1,umax1,umin2,umax2;
	double uninitialized = -9.473829456;
	umin1 = uninitialized;
	umax1 = uninitialized;
	umin2 = uninitialized;
	umax2 = uninitialized;
   parse_args(argc, argv, tbl, &nbins1, &nbins2, col1, col2, qcnd, &fudge, &maxbins, &umin1, &umax1, &umin2, &umax2);

	char selstr[100];
	sprintf(selstr,"min(%s),max(%s),min(%s),max(%s)",col1,col1,col2,col2);
	ibis::table *sel;
	if (qcnd == 0 || *qcnd == 0)
		sel = tbl->select(selstr,"1=1");
	else
		sel = tbl->select(selstr,qcnd);

	uint32_t tally;
	double area, min1, max1, min2, max2;
	get_data(sel,&tally,&area,&min1,&max1,&min2,&max2);
	if (umin1 != uninitialized) min1 = umin1;
	if (umax1 != uninitialized) max1 = umax1;
	if (umin2 != uninitialized) min2 = umin2;
	if (umax2 != uninitialized) max2 = umax2;

	delete sel;

//	printf("Content-type: application/json\n\n");
	printf("{\"c1\":\"%s\",\"min1\":%f,\"max1\":%f,",col1,min1,max1);
	printf("\"c2\":\"%s\",\"min2\":%f,\"max2\":%f,",col1,min1,max1);
	printf("\"total\":%d,\"data\":[\n",tally);
	
	std::vector<const ibis::part*> parts;
	tbl->getPartitions(parts);

	int nbins = nbins1*nbins2;
	if (nbins > maxbins) {
		int nb1 = ceil(sqrt(nbins1));
		int nb2 = ceil(sqrt(nbins2));
		int cutoff = ceil(fudge*tally/(nb1*nb2));
		get2DDist(parts[0],col1,min1,max1,nb1,col2,min2,max2,nb2,qcnd,cutoff);
	} else {
		get2DDist(parts[0],col1,min1,max1,nbins1,col2,min2,max2,nbins2,qcnd,0);
	}
	printf("]}\n");

	delete tbl;
   return 0;
} // main
