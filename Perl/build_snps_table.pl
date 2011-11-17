#!/usr/bin/perl -w
use strict;
use FastBit::Loader;
use Bio::EnsEMBL::Registry;

# get registry
my $reg = 'Bio::EnsEMBL::Registry';
$reg->load_all('ensembl_registry.conf');

my $geneAdaptor = $reg->get_adaptor( 'Arabidopsis_thaliana', 'core', 'gene' );

# connect to GWAS database
use DBI;
my $dbh = DBI->connect("DBI:mysql:database=stock_250k;host=bhsqldw2;port=3306","liang","liang") or die DBI->errstr;

# get all the snps
my %FB_snps;
my $sth = $dbh->prepare("select id,chromosome,position,allele1,allele2 from snps");
my $rv = $sth->execute();
while (my ($snp_id,$chr,$pos,$allele1,$allele2) = $sth->fetchrow_array) {
	# lookup gene at this position
	my $gene_id = 0;
	# calculate snp consequence
	my $consequence = 0;

	# add the info on this snp to the columns for fastbit
	push @{$FB_snps{snp_id}}, $snp_id;
	push @{$FB_snps{chr}}, $chr;
	push @{$FB_snps{pos}}, $pos;
	push @{$FB_snps{gene_id}}, $gene_id;
	push @{$FB_snps{consequence}}, $consequence;
}

# create the FastBit partition for the snps
my $part = FastBit::Loader->new("../fastbit/data/ath_snps");
$part->new_column("snp_id","UINT");
$part->new_column("chr","CATEGORY");
$part->new_column("pos","UINT");
$part->new_column("gene_id","UINT");
$part->new_column("consequence","CATEGORY");
$part->add_column_data("snp_id",$FB_snps{snp_id});
$part->add_column_data("chr",$FB_snps{chr});
$part->add_column_data("pos",$FB_snps{pos});
$part->add_column_data("gene_id",$FB_snps{gene_id});
$part->add_column_data("consequence",$FB_snps{consequence});

# another script will be used to append snp_ids to a GWAS table based on chr and pos
