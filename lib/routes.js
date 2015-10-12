var catalog = require('./catalog'),
  email = require('./email');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/landing', function(req, res) {
	res.render('landing');
});

app.get('/semana-de-la-dulzura', function(req, res) {
  res.render('download');
});

app.get('/descargar-semana-de-la-dulzura', function(req, res) {
  res.download('./public/img/el-gorrion-de-paris_semana-de-la-dulzura.jpg');
});

app.get('/servicios', function(req, res) {
  res.render('services');
});

app.get('/contactanos', function(req, res) {
  var product = req.query.p || '';
  res.render('contact', {product:product});
});

app.post('/contactanos', function(req, res, next) {
  var data = req.body;
  email.contact(data, function(err) {
    if (err) return next(err);
    // TODO: Redirect to thanks for contacting
    res.render('contact', data);
  });
});

// Catalog

app.get('/:section/:event', function(req, res, next) {
  var p = req.params;
  if (!catalog.hasEvent(p.section, p.event)) return next();

  var projects = catalog.projects(p.section, p.event);
  if (projects.length === 1) {
    return res.redirect('./'+projects[0]);
  }
  res.render('event', p);
});

app.get('/:section/:event/:project', function(req, res, next) {
  var p = req.params;
  if (!catalog.hasEvent(p.section, p.event)) return next();
  if (!catalog.hasProject(p.section, p.event, p.project)) return next();
  res.render('project', p);
});

// Errors

app.use(function(err, req, res, next){
  if (req.accepts('html')) {
  	res.render('error/500', {error:err.message, stack:err.stack||''});
  } else {
  	res.send(500);
  }
  handleError(err);
});

app.use(function(req, res, next){
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
