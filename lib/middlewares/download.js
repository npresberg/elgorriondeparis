module.exports = function(req, res) {
  res.download('./public'+req.originalUrl);
};