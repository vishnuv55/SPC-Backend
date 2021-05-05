class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  console.log(`" Error : ${statusCode} << ${message} >> |  ${req.method} : ${req.path} "`); // eslint-disable-line
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
module.exports = { ErrorHandler, handleError };
