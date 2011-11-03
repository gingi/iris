package Kbase::View::JSON;

use strict;
use base 'Catalyst::View::JSON';

__PACKAGE__->config(
    'View::JSON' => {
        allow_callback => 0,                          # defaults to 0
        callback_param => 'cb',                       # defaults to 'callback'
        expose_stash   => [qw(foo bar)],              # defaults to everything
    },
);
1;

=head1 NAME

Kbase::View::JSON - Catalyst JSON View

=head1 SYNOPSIS

See L<Kbase>

=head1 DESCRIPTION

Catalyst JSON View.

=head1 AUTHOR

Shiran Pasternak

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
