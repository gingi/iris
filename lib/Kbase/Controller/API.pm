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
    my $uri  = "http://wildcat:3001/scatter/GWAS/3396/1/100/150";
    my $ua   = LWP::UserAgent->new;
    my $data = $ua->get($uri);
    $self->status_ok($c,
        entity => JSON::XS->new->utf8->decode($data->content));
}

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
