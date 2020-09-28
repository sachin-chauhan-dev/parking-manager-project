const uuid = require('node-uuid');

module.exports = function (req, res, next) {
  req.id = uuid.v4();
  next();
};