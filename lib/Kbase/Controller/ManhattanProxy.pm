package Kbase::Controller::ManhattanProxy;

use strict;
use warnings;
use parent 'Catalyst::Controller';

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

    $c->response->body('Matched Kbase::Controller::ManhattanProxy in ManhattanProxy.');
}


=head1 AUTHOR

Jim

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
