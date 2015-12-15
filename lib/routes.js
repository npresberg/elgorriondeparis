var catalog = require('./catalog'),
	utils = require('./utils'),
	email = require('./email');

var router = require('express').Router();

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/servicios', function(req, res) {
	res.render('services');
});

router.get('/nosotras', function(req, res) {
	res.render('nosotras');
});

router.get('/contactanos', function(req, res) {
	var product = req.query.p || '';
	res.render('contact', {product:product});
});

router.post('/contactanos', function(req, res, next) {
	var data = req.body;
	email.contact(data, function(err) {
		if (err) return next(err);
		// TODO: Redirect to thanks for contacting
		res.render('contact', data);
	});
});

// Catalog

router.get('/eventos/:event', function(req, res, next) {
	var event = req.params.event;
	var product = catalog.items(event)[0];
	res.redirect('/eventos/'+event+'/'+product.id);
});

router.get('/eventos/:event/:product', function(req, res, next) {
	var product = catalog.get(req.params.event, req.params.product);
	res.render('product', {product:product, event:product.parent});
});

router.get('/eventos/:event/:product/:project', function(req, res, next) {
	var p = req.params;
	var project = catalog.get(p.event, p.product, p.project);
	var product = project.parent;
	res.render('project', {project:project, product:product, event:product.parent});
});

// Errors

router.use(function(err, req, res, next){
	if (req.accepts('html')) {
		res.render('error/500', {error:err.message, stack:err.stack});
	} else {
		res.send(500);
	}
	handleError(err);
});

router.use(function(req, res, next){
	if (req.accepts('html')) {
		res.render('error/404', {url:req.url});
	} else {
		res.send(404);
	}
});

process.on("uncaughtException", handleError);

// Utils

function handleError(err){
	console.log(err.stack || err.message);
}

module.exports = router;