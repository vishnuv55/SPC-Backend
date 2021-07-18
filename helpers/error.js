/**
 *
 *
 *
 * Class and controller for handling error
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 */

/**
 *
 *
 * Class extending js error class and defying new api error status object
 *
 */
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 *
 *
 * Controller to handle error
 *
 */
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
