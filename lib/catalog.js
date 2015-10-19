var glob = require('glob'),
	path = require('path'),
	marked = require('marked'),
	fs = require('fs'),
	utils = require('./utils'),
	nameQueue = [],
	catalog = exports;

const PUBLIC = 'public';
const CATALOG = 'catalogo';

catalog.initialize = function() {
	var filter = path.join(PUBLIC, CATALOG, '**', '*.*');
	glob(filter, {nosort:true, strict:true}, function(err, files) {
		if (err) throw err;
		files.forEach(register);
		nameQueue.forEach(loadName);

		//console.log(events)
	});
};

var events = createItem('');

function register(p) {
	var ps = path.relative(PUBLIC, p).split(path.sep);
	var url = '/' + ps.join('/');
	if (~p.indexOf('name.txt')) {
		nameQueue.push({uri:p, path:ps.slice(1, -1)});
	}
	// Ignore these, metadata
	if (ps.length < 5) return;

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
		read(p, function(err, data) {
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
	if (id) {
		item.url = calculateURL(item);
	}
	// Event
	if (parent === events) {
		item.thumb = itemFile(item, 'thumb.jpg');
		item.barrita = itemFile(item, 'barrita.png');
	}
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

function itemFile(item, file) {
	return ['', CATALOG, item.id, file].join('/');
}

function read(file, done) {
	fs.readFile(file, 'utf8', done);
	/*try {
		var data = fs.readFileSync(file, 'utf8');
		done(null, data);
	} catch (err) {
		done(err);
	}*/
}

function loadName(item) {
	read(item.uri, function(err, text) {
		if (text) {
			get(item.path).name = text.trim();
		}
	});
}

//- Retrieve

function get(path) {
	var data = events;
	for (var i = 0; i < path.length; i++) {
		data = data && data.map[path[i]];
	}
	return data;
}

catalog.get = function() {
	return get(arguments);
};

catalog.items = function() {
	return get(arguments).items();
};

catalog.events = catalog.items;

catalog.projectPhoto = function(event, product, project) {
	var proj = catalog.get(event, product, project);
	return proj.map['participaciones.png'] || proj.items()[0];
};
