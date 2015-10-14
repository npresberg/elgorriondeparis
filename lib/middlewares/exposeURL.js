module.exports = function(req, res, next) {
	res._render = res.render;
	res.render = render;
	next();
};

function render(tpl, data) {
	data = data || {};
	data.url = this.req.originalUrl;
	return this._render(tpl, data);
}