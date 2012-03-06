var iris   = require('./iris-base.js');
var config = iris.loadConfiguration();
var app    = iris.app;
var routes = iris.routes;
var exec   = require('child_process').exec;

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
		type: 'number'
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
				type: 'number',
				minimum: 1,
				maximum: 1
			}
		}
	},
	ranges: {
		d: field['partition']
	}
}


function run_command(executable, response, args) {
    var cmd = config.BIN_DIR + '/' + executable;
	args['d'] = config.FASTBIT_DATA_DIR + '/' + args['d'];
	for (var k in args) {
		cmd += ' -'+k+' '+args[k];
	}
    console.log(cmd);
    exec(cmd, { maxBuffer: 10000 * 1024}, function(error, stdout, stderr) {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(stdout);
    });
}

app.get('/', function(req,res) {
	res.json(schema);
});

app.get('/:command', function(req,res) {
	var command = req.params.command;
	var check = revalidator.validate(req.query, schema[command]);
	if (check['valid']) {
		run_command(command, res, req.query);
	} else {
		res.json(check['errors']);
	}
	
});

iris.startService();