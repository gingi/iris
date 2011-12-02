package Kbase::Controller::Widget;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller'; }

use URI;
use LWP::UserAgent;

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
        scatterplot_view => '/static/javascript/manhattan/index.html',
        query_params     => {
            id       => $study,
            study    => 'assoc',    #try 'padded' for HUGE amounts of data
            renderer => 'points'
        },
        no_wrapper => 1,
        title => "Study $study",
        frameborder => 0,
    );
}

sub scatterplot_remote : Local {
    my ($self, $c) = @_;
    my $study = $c->request->param('study');
    my $uri  = "http://localhost:3001/GWAS/$study";
    my $ua   = LWP::UserAgent->new;
    my $response = $ua->get($uri);
    my $html = $response->decoded_content;
    for my $pattern ('<a href=\"\K([^"]+?)', 'src=\"\K([^"]+?)') {
        $html =~ s/$pattern/@{[URI->new_abs($1, $response->base)]}/g;
    }
    $c->response->body($html);
}

sub flotplot : Local {
    my ($self, $c) = @_;
    $c->stash(template => 'scatterplot-flot.tt', no_wrapper => 1);
}

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
