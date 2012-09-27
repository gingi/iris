var iris   = require('./service-base.js');
var app    = iris.app;
var spawn  = require('child_process').spawn;

var revalidator = require('revalidator');

var field = {
	partition: {
		description: 'path to the fastbit partition',
		type: 'string',
		pattern: '^[a-zA-Z0-9_/]+$',
		required: true
	},
	column: {
		description: 'a column in a fastbit partiton',
		type: 'string',
		pattern: '^[a-zA-Z0-9_/]+$',
	},
	number: {
		description: 'a numerical value',
		type: 'string',
        pattern: '^\-?[0-9]+(\.[0-9]+)?$'
	}
};

var schema = {
	fbsql: {
		properties: {
			d: field['partition'],
			s: {
				description: 'select clause',
				type: 'string',
				required: true
			},
			w: {
				description: 'where clause',
				type: 'string'
			},
			o: {
				description: 'order by clause',
				type: 'string'
			}
		}
	},
	scatter: {
		properties: {
			d: field['partition'],
			c1: field['column'],
			c2: field['column'],
			n1: field['number'],
			n2: field['number'],
			b1: field['number'],
			b2: field['number'],
			x1: field['number'],
			x2: field['number'],
			a: {
				description: 'flag to use adaptive mode',
				type: 'string',
                pattern: '^1$'
			}
		}
	},
	ranges: {
		d: field['partition']
	},
	gwas2go: {
		s: { description: 'study id', type: 'number', required: true },
		w: { description: 'where clause', type: 'string' }
	}
}

function runCommand(executable, response, args) {
    var cmd = iris.config.BINDIR + '/' + executable;
	args['d'] = (args.hasOwnProperty('d')) ?
        iris.config.FASTBIT_DATADIR + '/' + args['d'] :
        iris.config.FASTBIT_DATADIR;
    var spawnArgs = [];
    for (var k in args) {
        spawnArgs.push('-' + k);
        spawnArgs.push(args[k]);
    }
    var fb = spawn(cmd, spawnArgs);

    fb.stdout.on('data', function (data) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(data);
    });
    
    fb.on('close', function (data) { response.end(); });
    fb.stderr.on('data', function (data) {
        console.log("Fastbit stderr (" + executable + "):", data);
    });
    
    fb.on('exit', function (code, signal) {
        if (signal != null) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write("500: Fastbit runtime error (" + signal + ")");
        }
    });
}

app.get('/', function (req, res) {
	res.json(schema);
});

app.get('/:command', function (req, res) {
	var command = req.params.command;
	var check = revalidator.validate(req.query, schema[command]);
	if (check['valid']) {
		runCommand(command, res, req.query);
	} else {
		res.json(check['errors']);
	}
	
});

iris.startService();