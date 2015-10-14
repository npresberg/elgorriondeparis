module.exports = function(req, res, next) {
	req.url = req.url.replace(/%C3%B1/g,'n%CC%83');
	req.originalUrl = req.url.replace(/n%CC%83/g,'ñ');
	next();
};