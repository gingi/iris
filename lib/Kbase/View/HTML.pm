package Kbase::View::HTML;
use Moose;

extends 'Catalyst::View::TT';
with 'Catalyst::View::Component::SubInclude';

__PACKAGE__->config(
    TEMPLATE_EXTENSION => '.tt2',

    # Set to 1 for detailed timer stats in your HTML as comments
    TIMER => 0,

    # This is your wrapper template located in the 'root/src'
    WRAPPER           => 'kbase_wrapper.tt2',
    render_die        => 1,
    subinclude_plugin => 'SubRequest',
);

=head1 NAME

Kbase::View::HTML - TT View for Kbase

=head1 DESCRIPTION

TT View for Kbase.

=head1 SEE ALSO

L<Kbase>

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
