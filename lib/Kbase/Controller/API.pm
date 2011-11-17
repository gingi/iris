package Kbase::Controller::API;

use namespace::autoclean;
use parent 'Catalyst::Controller::REST';

__PACKAGE__->config(default => 'application/json');

use Readonly;
use JSON::XS;

Readonly my $FB_URI => 'http://brie.cshl.edu/~olson/qdv/web';

=head1 NAME

Kbase::Controller::API - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut

=head2 index

=cut

sub fastbit : Local : ActionClass('REST') {
}

sub fastbit_GET {
    my ($self, $c) = @_;

    my $uri  = 'http://wildcat:3001/scatter/GWAS/3396/1/800/800';
    my $ua   = LWP::UserAgent->new;
    my $data = $ua->get($uri);
    $self->status_ok($c,
        entity => JSON::XS->new->utf8->decode($data->content));
=pod
    $self->status_ok(
        $c,
        entity => {
            data => [ [ 657, 7607981, 0, 2.563327, 10710, 6 ] ],
            max1 => 30429953,
            max2 => 10.253307,
            min1 => 657,
            min2 => 0,
            total => 52381
        }
    );
=cut
}

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
