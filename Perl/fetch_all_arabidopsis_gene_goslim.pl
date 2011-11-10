#!/usr/bin/perl

use strict;
use boolean;
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
my $mongodb = $mongodb_conn->get_database('kbase_plants') ; # connects to the mongodb "kbase_plants"
my $collection = $mongodb->get_collection ('go_slim');
$collection->remove();
$collection->ensure_index({"gene_id" => 1}, { unique => true});

my @genes;

# for testing
my $limit = 100000;
my $i     = 0;


foreach my $gene ( @{ $geneAdaptor->fetch_all } ) {
    my %obj;
    $obj{'gene_id'} = $gene->stable_id;
    my %stored;
    $i++;
    foreach my $dblink ( @{ $gene->get_all_DBLinks('goslim_goa') } ) {
        my $term = $GOAdaptor->fetch_by_accession( $dblink->primary_id );
        foreach my $ancestor ( @{ $term->ancestors } ) {
            if ( exists $accepted_ancestors{ $ancestor->name } ) {
                unless ( exists $stored{ $ancestor->name }->{ $term->name } ) {
                    push @{ $obj{ $ancestor->name } }, $term->name;
                    $stored{ $ancestor->name }->{ $term->name } = 1;
                }
            }
        }
    }
    push @genes, \%obj;
    last if ( $i == $limit );
}

print STDERR "fetched ",scalar(@genes), " from Ensembl\n";

my $json_text = to_json( \@genes );
print $json_text, "\n";
$collection->batch_insert(\@genes,{safe => 1});



=head1 NAME

fetch_all_arabidopsis_gene_goslim.pl - Retrieving Arabidopsis GO-Slim from Gramene

=head1 DESCRIPTION

Fetches Arabidopsis genes from Gramene
Uses the Ensembl ontology adaptors to retrieve GO-Slim terms for the genes
Only the molecular_function and biological_process ontologies are kept.

Creates a JSON object for the fetched data, prints it out.
Stores the JSON data into a local MongoDB.

=head1 AUTHORS

Jerm <chia@cshl.edu>

=cut
