var express = require('express'), 
	http = require('http'),
	catalog = require('./lib/catalog'),
	utils = require('./lib/utils');

var app = global.app = express();

app.configure('development', function(){
	app.use(require('./lib/latinizeURL'));
	app.use(express.logger('dev'));

	// DEV environment vars
	for (var key in process.env) {
		if (key.indexOf('GP_') === 0) {
			process.env[key.slice(3)] = process.env[key];
		}
	}
	app.locals.production = false;
});

app.configure('production', function(){
	app.use(express.compress());
	app.locals.production = true;
});

app.configure(function(){
	app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.locals({
  	// Disable layout, we use inheritance
  	layout: false,
		// Pretty printing of html
		pretty: true
	});
    
	// Catalog
	catalog.initialize();
	app.locals(catalog);

	app.locals(utils);

	//app.use(express.favicon());
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/catalogo'));
	
	//app.use(express.cookieParser());
	// Prevent warning from Connect
	//app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());

	app.use(app.router);
});

require('./lib/routes');


var port = process.env.PORT || 8080;
var host = process.env.IP || null;

var server = http.createServer(app).listen(port, host, function(){
	console.log("Express server listening on port " + port);
});