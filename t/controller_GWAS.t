use strict;
use warnings;
use Test::More;


use Catalyst::Test 'Kbase';
use Kbase::Controller::GWAS;

ok( request('/gwas')->is_success, 'Request should succeed' );
done_testing();
