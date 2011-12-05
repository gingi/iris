use strict;
use warnings;

use Kbase;

my $app = Kbase->apply_default_middlewares(Kbase->psgi_app);
$app;

