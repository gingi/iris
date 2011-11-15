use strict;
use warnings;
use Test::More;


use Catalyst::Test 'Kbase';
use Kbase::Controller::Widget;

ok( request('/widget')->is_success, 'Request should succeed' );
done_testing();
