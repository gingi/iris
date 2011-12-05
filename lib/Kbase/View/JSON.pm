package Kbase::View::JSON;

use strict;
use base 'Catalyst::View::JSON';
use JSON::XS ();

sub encode_json {
    my($self, $c, $data) = @_;
    my $encoder = JSON::XS->new->ascii->pretty->allow_nonref;
    $encoder->allow_blessed(1);
    $encoder->encode($data);
}

1;

__PACKAGE__->config(
    'View::JSON' => {
        allow_callback => 1,                          # defaults to 0
        callback_param => 'cb',                       # defaults to 'callback'
        # expose_stash   => [qw(foo bar)],              # defaults to everything
    },
);

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
