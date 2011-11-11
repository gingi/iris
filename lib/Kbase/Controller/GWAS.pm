package Kbase::Controller::GWAS;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller::HTML::FormFu'; }

=head1 NAME

Kbase::Controller::GWAS - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut

=head2 index

=cut

sub index : Path : Args(0) {
    my ($self, $c) = @_;

    my $study = $c->request->param('study');
    if (!defined($study)) {
        $c->forward('select_study');
    } else {
        my $top = "<h1>Study $study</h1>";

        # $c->subreq('/gwas/manhattan', { study => $study });
        my $bottom = 'Nothing here to see';
        $c->stash(
            template     => '2widgets.tt2',
            query_params => {
                id       => $study,
                pinZero  => 0,
                refine   => 1,
                study    => 'assoc',    #try 'padded' for HUGE amounts of data
                renderer => 'points'
            },
            topwidget    => $top,
            bottomwidget => $bottom,
        );
    }
}

sub select_study : Path : FormConfig {
    my ($self, $c) = @_;

    my $form = $c->stash->{form};
    if ($form->submitted_and_valid) {
        $c->stash(study => $form->param('study'));
        $c->forward('index');
    } else {
        my $select = $form->get_element({ name => 'study' });
        $select->options(
            [   [ 3032, 'Arabidopsis 2010 Study 3032' ],
                [ 3034, 'Arabidopsis 2010 Study 3034' ],
                [ 3035, 'Arabidopsis 2010 Study 3035' ],
                [ 1,    'Arabidopsis 2010 Nonexistent Study' ],
            ]
        );
    }
    $c->stash(template => 'gwas/select_study.tt2');
}

sub manhattan : Local : Args(0) {
    my ($self, $c) = @_;
    $c->stash(study => $c->request->param('study'));
    $c->forward('View::JSON');
}

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
