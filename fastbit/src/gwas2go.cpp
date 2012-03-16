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
	    << "[-d data directory] " << std::endl
	    << "[-s study id] " << std::endl
		<< "[-w where clause for GWAS table ]" << std::endl;
} // usage

// function to parse the command line arguments
static void parse_args(int argc, char** argv, const char*& datadir,
		       	 		  int *study, const char*& qcond) {
  
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
					++ i;
					datadir = argv[i];
					break;
      		case 's':
					++ i;
					*study = atoi(argv[i]);
					break;
      		case 'w':
					++ i;
					qcond = argv[i];
					break;
			} // switch (argv[i][1])
		} // normal arguments
	} // for (inti=1; ...)
} // parse_args

ibis::qExpr* build_qDR(ibis::table* tbl, const char* jcol) {
	// get the first column from res1
   ibis::table::stringList nms = tbl->columnNames();
   ibis::table::typeList tps = tbl->columnTypes();
	
	const size_t nr = static_cast<size_t>(tbl->nRows());
	ibis::array_t<uint32_t> arr(nr);
	int64_t ierr = tbl->getColumnAsUInts(nms[0], arr.begin());
	if (ierr < 0 || ((size_t) ierr) < nr) {
		std::cerr << "error fetching " << nms[0] << std::endl;
		exit(-2);
	}
	// query the second table
	return new ibis::qDiscreteRange(jcol, arr);
}

int main(int argc, char** argv) {
   const char* qcond=0;
   const char* datadir=0;
	int study;

	parse_args(argc, argv, datadir, &study, qcond);

	if ((qcond == 0 || *qcond == 0)) {
		qcond = "1=1";
	}

	// first query the gwas table
	char gwas_table[100];
	sprintf(gwas_table,"%s/GWAS/%d",datadir,study);
	ibis::table* tbl1 = ibis::table::create(gwas_table);
   ibis::table *res1 = tbl1->select("snp_id,count(*)",qcond);;
	ibis::qExpr* snp_expr = build_qDR(res1,"snp_id");

	// go from snps to gene_ids
	char consequence_table[100];
	sprintf(consequence_table,"%s/snp_consequences",datadir);
	ibis::table* tbl2 = ibis::table::create(consequence_table);
	ibis::table *res2 = tbl2->select("gene_id,count(*)",snp_expr);
	ibis::qExpr* gene_expr = build_qDR(res2,"gene_id");
	
	// go from gene_ids to GO terms
	char go_table[100];
	sprintf(go_table,"%s/gene2GO",datadir);
	ibis::table* tbl3 = ibis::table::create(go_table);
	ibis::table *res3 = tbl3->select("GO_term,count(*)",gene_expr);

	res3->dump(std::cout,"JSON");

	delete res3;
	delete res2;
	delete res1;
	delete tbl3;
	delete tbl2;
	delete tbl1;
   return 0;
} // main
