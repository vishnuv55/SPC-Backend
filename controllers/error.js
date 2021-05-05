const { ErrorHandler } = require('../helpers/error');

const handleNotFound = (req, res, next) => {
  next(new ErrorHandler(404, 'Requested url does not exist'));
};

module.exports = { handleNotFound };
