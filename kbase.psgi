use strict;
use warnings;

use Kbase
columns=
type=tsv
;

my $app = Kbase
columns=
type=tsv
->apply_default_middlewares(Kbase
columns=
type=tsv
->psgi_app);
$app;

