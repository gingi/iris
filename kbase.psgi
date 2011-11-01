use strict;
use warnings;

use kbase;

my $app = kbase->apply_default_middlewares(kbase->psgi_app);
$app;

