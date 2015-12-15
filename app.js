var express = require('express'), 
	http = require('http'),
	catalog = require('./lib/catalog'),
	utils = require('./lib/utils'),
	bodyParser = require('body-parser');

function locals(data) {
	for (var key in data) {
		app.locals[key] = data[key];
	}
}

var app = global.app = express();
var prod = process.env.NODE_ENV === 'production';
//- Locals

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('x-powered-by', false);
locals({
	// Disable layout, we use inheritance
	layout: false,
	// Pretty printing of html
	pretty: true,
	producion: prod
});

// Catalog
catalog.initialize();
locals(catalog);

locals(utils);

//- Middlewares

if (prod) app.use(require('compression')());
app.use(require('./lib/middlewares/latinizeURL'));
app.use('/bajar', require('./lib/middlewares/download'));
//app.use(express.favicon());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/catalogo'));
	
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(require('./lib/middlewares/exposeURL'));
app.use(require('./lib/routes'));


var port = process.env.PORT || 8080;
var host = process.env.IP || null;

var server = http.createServer(app).listen(port, host, function(){
	console.log("Express server listening on port " + server.address().port);
});