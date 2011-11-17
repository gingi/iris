package Kbase::Controller::GWAS;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller::HTML::FormFu'; }

__PACKAGE__->config({ default_view => 'HTML' });

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
    $c->response->body('Matched Kbase::Controller::GWAS in Widget.');
}

sub view : Local {
    my ($self, $c) = @_;
    my $study = $c->request->param('study');
    my $top = $c->subrequest("/widget/scatterplot", {}, { study => $study });
    my $bottom = $c->subrequest("/widget/flotplot");
    $c->stash(
        template  => '2widgets.tt2',
        topwidget => $top,
        bottomwidget => $bottom,
    );
}

sub study : Local : FormConfig {
    my ($self, $c) = @_;

    my $form = $c->stash->{form};
    if ($form->submitted_and_valid) {
        $c->stash(study => $form->param('study'));
        $c->detach('view');
    } else {
        my $select = $form->get_element({ name => 'study' });
        $select->options(
            [   [ 3032, 'Arabidopsis 2010 Study 3032' ],
                [ 3034, 'Arabidopsis 2010 Study 3034' ],
                [ 3035, 'Arabidopsis 2010 Study 3035' ],
                [ 1,    'Arabidopsis 2010 Nonexistent Study' ],
            ]
        );
        $c->stash(template => 'gwas/study.tt2');
    }
}

sub end :ActionClass('RenderView') {}

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
