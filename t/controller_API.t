use strict;
use warnings;
use Test::More;


use Catalyst::Test 'Kbase';
use Kbase::Controller::API;

ok( request('/api/fastbit')->is_success, 'Fastbit request should succeed');
done_testing();

