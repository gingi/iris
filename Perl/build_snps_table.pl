#!/usr/bin/perl -w
use strict;
use lib ("/home/olson/src/scripts/");
use FastBit::Loader;
use DBI;

# connect to ensembl core db
my $ens_dbh = DBI->connect(
"DBI:mysql:database=arabidopsis_thaliana_core_34_64_10;host=cabot;port=3306",
    'ensembl_rw', '()ryz@'
) or DBI->error;

# get all the stable IDs
my %dbID;
my $ens_sth =
  $ens_dbh->prepare("select stable_id, gene_id from gene_stable_id");
my $rv = $ens_sth->execute();
my %gene_stable_id = (gene_id => [], stable_id => []);
while ( my ( $stable_id, $gene_id ) = $ens_sth->fetchrow_array ) {
    $dbID{$stable_id} = $gene_id;
	push @{$gene_stable_id{gene_id}}, $gene_id;
	push @{$gene_stable_id{stable_id}}, $stable_id;
}
# write the stable ids to a fastbit partition
my $gene_part = FastBit::Loader->new("gene_stable_id");
$gene_part->new_column("gene_id", "UINT");
$gene_part->new_column("stable_id", "TEXT");
$gene_part->add_column_data("gene_id", $gene_stable_id{gene_id});
$gene_part->add_column_data("stable_id", $gene_stable_id{stable_id});

# load consequence types
my %consequence_types = ( consequence_type_id => [], consequence_type => [] );
my $ct_file = shift @ARGV;
open( my $fh, "<", $ct_file ) or die "failed to open $ct_file : $!\n";
my $ct_id = 1;
while (<$fh>) {
    chomp;
    $dbID{$_} = $ct_id;
    push @{ $consequence_types{consequence_type_id} }, $ct_id;
    push @{ $consequence_types{consequence_type} },    $_;
    $ct_id++;
}
close $fh;
my $ct_part = FastBit::Loader->new("consequence_types");
$ct_part->new_column( "consequence_type",    "CATEGORY" );
$ct_part->new_column( "consequence_type_id", "UINT" );
$ct_part->add_column_data( "consequence_type",
    $consequence_types{consequence_type} );
$ct_part->add_column_data( "consequence_type_id",
    $consequence_types{consequence_type_id} );

# load SNP annotation file
my %SNP_pos2id;
my %consequences = ( snp_id => [], gene_id => [], consequence_type_id => [] );
my $nextid       = 1;
my $snp_file     = shift @ARGV;
open( $fh, "<", $snp_file ) or die "failed to open $snp_file : $!\n";
while (<$fh>) {
    chomp;
    my ( $chr, $pos, $stable_id, $consequence ) = split /\t/, $_;
    if ( not exists $SNP_pos2id{$chr}{$pos} ) {
        $SNP_pos2id{$chr}{$pos} = $nextid;
        $nextid++;
    }
    push @{ $consequences{snp_id} },              $SNP_pos2id{$chr}{$pos};
    push @{ $consequences{gene_id} },             defined $dbID{$stable_id} ? $dbID{$stable_id} : 0;
    push @{ $consequences{consequence_type_id} }, defined $dbID{$consequence} ? $dbID{$consequence} : 0;
}
close $fh;

# create the snp consequences partition (snp_id, gene_id, consequence_type_id)
my $cons_part = FastBit::Loader->new("snp_consequences");
$cons_part->new_column( "snp_id",              "UINT" );
$cons_part->new_column( "gene_id",             "UINT" );
$cons_part->new_column( "consequence_type_id", "UINT" );
$cons_part->add_column_data( "snp_id",  $consequences{snp_id} );
$cons_part->add_column_data( "gene_id", $consequences{gene_id} );
$cons_part->add_column_data( "consequence_type_id",
    $consequences{consequence_type_id} );

# create snp positions partition (snp_id, chr, pos)
my %positions = ( snp_id => [], chr => [], pos => [] );
for my $chr ( sort { $a <=> $b } keys %SNP_pos2id ) {
    for my $pos ( sort { $a <=> $b } keys %{ $SNP_pos2id{$chr} } ) {
        push @{ $positions{snp_id} }, $SNP_pos2id{$chr}{$pos};
        push @{ $positions{chr} },    $chr;
        push @{ $positions{pos} },    $pos;
    }
}
my $pos_part = FastBit::Loader->new("snp_positions");
$pos_part->new_column( "snp_id", "UINT" );
$pos_part->new_column( "chr",    "CATEGORY" );
$pos_part->new_column( "pos",    "UINT" );
$pos_part->add_column_data( "snp_id", $positions{snp_id} );
$pos_part->add_column_data( "chr",    $positions{chr} );
$pos_part->add_column_data( "pos",    $positions{pos} );

my @columns = (
    [
        "pos", "UINT",
        { index  => "<binning nbins=2000/><encoding interval-equality/>" }
    ],
    [
        "score", "FLOAT",
        { index => "<binning nbins=2000/><encoding interval-equality/>" }
    ],
    [ "MAF",    "FLOAT" ],
    [ "MAC",    "UBYTE" ],
    [ "snp_id", "UINT" ]
);

for my $tsv (@ARGV) {
    open( $fh, "<", $tsv ) or die "failed to open $tsv for reading: $!\n";
    my %data;
    while (<$fh>) {
        next if /^chromosome/;
        my ( $chr, $pos, $score, $maf, $mac ) = split /\t/, $_;
        $score = -1 * log( $score ) / log(10);
        if ( not exists $SNP_pos2id{$chr}{$pos} ) {
			$SNP_pos2id{$chr}{$pos} = $nextid;
			$nextid++;
        }
        push @{ $data{$chr} }, [$pos, $score, $maf, $mac, $SNP_pos2id{$chr}{$pos}];
    }
    close $fh;

    for my $chr ( keys %data ) {

        # sort by snp_id and convert to columns
        my @col;
        for my $row ( sort { $a->[4] <=> $b->[4] } @{ $data{$chr} } ) {
            for ( my $i = 0 ; $i < @$row ; $i++ ) {
                push @{ $col[$i] }, $row->[$i];
            }
        }

        my ($id) = $tsv =~ m/(\d+)_results.tsv/;
        my $part = FastBit::Loader->new("GWAS/$id/$chr");
        $part->{metaTags} = "id = $id, chr = $chr";

        for ( my $i = 0 ; $i < @columns ; $i++ ) {
            $part->new_column( @{ $columns[$i] } );
            $part->add_column_data( $columns[$i][0], $col[$i] );
        }
    }
}
