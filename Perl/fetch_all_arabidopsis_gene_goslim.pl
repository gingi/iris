#!/usr/bin/perl

use strict;
use Bio::EnsEMBL::Registry;
use JSON;
use MongoDB::Connection;

# get registry
my $reg = 'Bio::EnsEMBL::Registry';
$reg->load_all('ensembl_registry.conf');

# accepting only molecular_function and biological_process GO categories
my %accepted_ancestors = (
    'molecular_function' => 1,
    'biological_process' => 1
);

my $geneAdaptor = $reg->get_adaptor( 'Arabidopsis_thaliana', 'core', 'gene' );
my $ontologyAdaptor = $reg->get_DBAdaptor( 'multi', 'ontology' );
my $GOAdaptor = $ontologyAdaptor->get_GOTermAdaptor;

my $mongodb_dsn = "mongodb://wildcat.cshl.edu:27017";
my $mongodb_conn = MongoDB::Connection->new("host"=>$mongodb_dsn);
my $mongodb = $mongodb_conn->kbase_plants; # connects to the mongodb "kbase_plants"


my @genes;

my $limit = 100;
my $i     = 0;


foreach my $gene ( @{ $geneAdaptor->fetch_all } ) {
    my $obj;
    my %stored;
    $i++;
    last if ( $i == $limit );
    foreach my $dblink ( @{ $gene->get_all_DBLinks('goslim_goa') } ) {
        my $term = $GOAdaptor->fetch_by_accession( $dblink->primary_id );
        foreach my $ancestor ( @{ $term->ancestors } ) {
            if ( exists $accepted_ancestors{ $ancestor->name } ) {
                $obj->{'gene_id'} = $gene->stable_id;
                unless ( exists $stored{ $ancestor->name }->{ $term->name } ) {
                    push @{ $obj->{ $ancestor->name } }, $term->name;
                    $stored{ $ancestor->name }->{ $term->name } = 1;
                }
            }
        }
    }
    $mongodb->insert($obj);
    push @genes, $obj;
}

my $json_text = to_json( \@genes );
print $json_text, "\n";

