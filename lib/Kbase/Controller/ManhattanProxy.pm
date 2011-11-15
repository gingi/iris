package Kbase::Controller::ManhattanProxy;

use strict;
use warnings;
use parent 'Catalyst::Controller';
use LWP::UserAgent;
use URI::Escape ();

=head1 NAME

Kbase::Controller::ManhattanProxy - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;

    $c->response->body('Improper access point!');
}

sub get_chromosomes :Local :Args(0) {
    my ( $self, $c ) = @_;

    my $ua = LWP::UserAgent->new();
    my $results = $ua->get('http://brie.cshl.edu/~olson/qdv/web/chr_list.pl?g=at');

    $c->response->content_type('application/json');
    $c->response->body($results->content);
}

sub get_scores :Local :Args(2) {
    my ( $self, $c, $study, $id) = @_;

    my $url = sprintf("http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=fbsql&d=GWAS/%s&s=chr,min(score),max(score)&w=id=%s",
        $study,
        $id
    );

    my $ua = LWP::UserAgent->new();
    my $results = $ua->get($url);

    $c->response->content_type('application/json');
    $c->response->body($results->content);
}

sub get_coordinates :Local :Args(4) {
    my ( $self, $c, $bins, $study, $experiment, $chromosome, $clause ) = @_;

    my $url = sprintf("http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=get2DDist&b=%s&d=GWAS/%s&c1=pos&c2=score&w=id=%s+and+chr=%s",
        $bins,
        $study,
        $experiment,
        $chromosome
    );
    
    my $clause = $c->request->query_parameters->{'w'};
print STDERR "CLAUSE IS $clause\n";    
    if (defined $clause) {
        $url .= URI::Escape::uri_escape(" and $clause");
    }
    
print STDERR "URL : $url\n";
    my $ua = LWP::UserAgent->new();
    my $results = $ua->get($url);

    $c->response->content_type('application/json');
    $c->response->body($results->content);
}

sub get_scatter :Local :Args(6) {
    my ( $self, $c, $b1, $b2, $s, $study, $experiment, $chromosome ) = @_;

    my $url = sprintf("http://brie.cshl.edu/~olson/qdv/web/run.pl?s=2&exe=scatter&b1=%s&b2=%s&s=%s&d=GWAS/%s&w=id=%s+and+chr=%s&c1=pos&c2=score",
        $b1,
        $b2,
        $s,
        $study,
        $experiment,
        $chromosome
    );
print STDERR "URL IS $url ", $c->request->arguments->{'w'}, "\n";
    my $ua = LWP::UserAgent->new();
    my $results = $ua->get($url);

    $c->response->content_type('application/json');
    $c->response->body($results->content);
}

sub get_all_points :Local :Args(3) {
    my ( $self, $c, $study, $experiment, $chromosome ) = @_;

    my $url = sprintf("http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=fbsql&d=GWAS/%s&s=chr,pos,score&w=id=%s+and+chr=%s",
        $study,
        $experiment,
        $chromosome
    );

    my $ua = LWP::UserAgent->new();
    my $results = $ua->get($url);

    $c->response->content_type('application/json');
    $c->response->body($results->content);
}

sub get_coordinates2 :Local :Args(5) {
    my ( $self, $c, $bins1, $bins2, $study, $experiment, $chromosome ) = @_;

    my $url = sprintf("http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=scatter&b1=%s&b2=%s&d=GWAS/%s&c1=pos&c2=score&w=id=%s+and+chr=%s",
        $bins1,
        $bins2,
        $study,
        $experiment,
        $chromosome
    );

    my $ua = LWP::UserAgent->new();
    my $results = $ua->get($url);

    $c->response->content_type('application/json');
    $c->response->body($results->content);
}



=head1 AUTHOR

Jim

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
