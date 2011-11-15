package Kbase::Controller::Widget;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

Kbase::Controller::Widget - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut

=head2 index

=cut

sub index : Path : Args(0) {
    my ($self, $c) = @_;

    $c->response->body('Matched Kbase::Controller::Widget in Widget.');
}

sub scatterplot : Local {
    my ($self, $c) = @_;
    my $study = $c->request->param('study');
    $c->stash(
        template         => 'scatterplot.tt2',
        scatterplot_view => '/static/javascript/manhattan/index-debug.html',
        query_params     => {
            id       => $study,
            pinZero  => 0,
            refine   => 1,
            study    => 'assoc',    #try 'padded' for HUGE amounts of data
            renderer => 'points'
        },
        no_wrapper => 1,
        title => "Study $study",
        frameborder => 0,
    );
}

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
