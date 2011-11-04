package Kbase::Controller::ManhattanProxy;

use strict;
use warnings;
use parent 'Catalyst::Controller';
use LWP::UserAgent;

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
    my ( $self, $c, $bins, $study, $experiment, $chromosome ) = @_;

    my $url = sprintf("http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=get2DDist&b=%s&d=GWAS/%s&c1=pos&c2=score&w=id=%s+and+chr=%s",
        $bins,
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
