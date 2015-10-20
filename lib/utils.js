var transliterator = require('transliterator');

exports.toName = function(id) {
	return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
};

exports.toHTML = function(text) {
	return text.replace(/\r?\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};

exports.latinize = function(str) {
	return transliterator(str);
};

exports.toText = function(html) {
	return html
		.replace(/<br[^>]+>/g, '\n')
		.replace(/\s+/g, ' ')
		.replace(/<\/li>/g, ',')
		.replace(/, ?<\/[ou]l>/g, '')
		.replace(/<[^>]+>/g, '');
};

exports.flatText = function(str) {
	return str.replace(/(\r?\n|<br[^>]+>)+/g, ' ');
};

exports.values = function(obj) {
	return Object.keys(obj).map(function(key) {
		return obj[key];
	});
};

exports.copy = function(dest, src) {
	for (var key in src) {
		dest[key] = src[key];
	}
	return dest;
};

//- Exclusively for templates

exports.activeIf = function(url, section) {
	return url.split('/')[1] === section ? 'active' : '';
};

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

exports.currentMonth = function() {
	var month = new Date().getMonth();
	return MONTHS[month];
};