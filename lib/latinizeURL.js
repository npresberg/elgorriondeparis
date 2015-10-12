module.exports = function(req, res, next) {
	req.url = req.url.replace(/%C3%B1/g,'n%CC%83');
	next();
};