var glob = require('glob'),
	path = require('path'),
	marked = require('marked'),
	fs = require('fs'),
	utils = require('./utils'),
	catalog = exports;

const PUBLIC = 'public';
const CATALOG = 'catalogo';

catalog.initialize = function() {
	var filter = path.join(PUBLIC, CATALOG, '**', '*.*');
	glob(filter, {nosort:true, strict:true}, function(err, files) {
		if (err) throw err;
		files.forEach(register);

		//console.log(JSON.stringify(events, null, 2))
	});
};

var events = createItem('');

function register(p) {
	var ps = path.relative(PUBLIC, p).split(path.sep);
	var url = '/' + ps.join('/');

	var event = events.ensureItem(ps[1]);
	var product = event.ensureItem(ps[2]);
	var project = product.ensureItem(ps[3]);
	var file = ps[4];

	// First file of this project
	if (!project.thumb) {
		project.thumb = getProjectThumb;
		// Default if no md is then found
		project.desc = project.name;
	}
	
	if (~file.indexOf('.md')) {
		fs.readFile(p, {encoding:'utf8'}, function(err, data) {
			if (err) project.desc = err.message;
			try {
				project.desc = marked(data);
			} catch (err) {
				project.desc = err.message;
			}
		});
	} else {
		project.map[file] = url;
	}
}

function createItem(id, parent) {
	var item = {id:id, name:utils.toName(id), parent:parent, map:{}, items:getItems, ensureItem:ensureItem};
	item.url = calculateURL(item);
	return item;
}

function getItems() {
	return utils.values(this.map);
}

function ensureItem(id) {
	if (!this.map[id]) {
		this.map[id] = createItem(id, this);
	}
	return this.map[id];
}

function getProjectThumb() {
	return this.map['participaciones.png'] || this.items()[0];
}

function calculateURL(item) {
	var parts = [];
	do { parts.unshift(item.id);
	} while ((item = item.parent));

	return '/eventos'+parts.join('/');
}

//- Retrieve

catalog.get = function() {
	var data = events;
	for (var i = 0; i < arguments.length; i++) {
		data = data && data.map[arguments[i]];
	}
	return data;
};

catalog.items = function() {
	return catalog.get.apply(this, arguments).items();
};

catalog.events = catalog.items;

catalog.projectPhoto = function(event, product, project) {
	var proj = catalog.get(event, product, project);
	return proj.map['participaciones.png'] || proj.items()[0];
};
