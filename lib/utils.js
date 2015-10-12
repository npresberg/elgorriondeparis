exports.toName = function(id) {
	return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
};

exports.toHTML = function(text) {
	return text.replace(/\r?\n/g, '<br />').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};