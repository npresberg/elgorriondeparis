var glob = require('glob'),
	path = require('path'),
	marked = require('marked'),
	fs = require('fs');

var PUBLIC = 'public';
var SECTIONS = 'secciones';
var sections = {};

exports.initialize = function() {
	var filter = path.join(PUBLIC, SECTIONS, '**', '*.*');
	glob(filter, {nosort:true, strict:true}, function(err, files) {
		if (err) return done(err);
		files.forEach(register);
	});
};

function register(p) {
	var parts = path.relative(PUBLIC, p).split(path.sep);
	var url = '/' + parts.join('/');

	var section = parts[1];
	var event = parts[2];
	var project = parts[3];
	var file = parts[4];

	var catalog = sections[section] || (sections[section] = {});
	var projects = catalog[event] || (catalog[event] = {});
	var proj = projects[project] || (projects[project] = {photos:[]});
	
	if (p.indexOf('.md') !== -1) {
		fs.readFile(p, {encoding:'utf8'}, function(err, data) {
			if (err) proj.desc = err.message;
			try {
				proj.desc = marked(data);
			} catch (err) {
				proj.desc = err.message;
			}
		});
	} else if (url.indexOf('participaciones.png') === -1) {
		proj.photos.push(url);
	} else {
		proj.photos.unshift(url);
	}
};

exports.sections = function() {
	return Object.keys(sections);
};

exports.events = function(section) {
	return Object.keys(sections[section]);
};

exports.hasEvent = function(section, event) {
	return section in sections && event in sections[section];
};

exports.projects = function(section, event) {
	return Object.keys(sections[section][event]);
};

exports.hasProject = function(section, event, project) {
	return this.hasEvent(section, event) && project in sections[section][event];
};

exports.projectDesc = function(section, event, project) {
	return sections[section][event][project].desc || '';
};

exports.photos = function(section, event, project) {
	return sections[section][event][project].photos;
};

exports.projectPhoto = function(section, event, project) {
	return exports.photos(section, event, project)[0];
};

exports.homePhotos = function() {
	// TODO
	return [];
};