/**
 *
 *
 *
 * This middleware is used to check whether the user is authenticated or not.
 * Function verifies the cookie and store user (student,execom) data in req.user if jwt matches.
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 *
 *
 */

const jwt = require('jsonwebtoken');
const student = require('../models/student');
const execom = require('../models/execom');
const { ErrorHandler } = require('../helpers/error');

const authentication = (userType) => {
  let userModel;

  // Checking the userType & specifying userModel accordingly
  if (userType === 'student') {
    userModel = student;
  } else if (userType === 'execom') {
    userModel = execom;
  } else if (userType !== 'admin') {
    throw new Error('Invalid UserType');
  }

  // Middleware function
  return async (req, res, next) => {
    let userDetails;

    const token = req.cookies.jwt;

    // Checking if token exist
    if (!token) {
      return next(new ErrorHandler(401, 'JWT Token is missing'));
    }

    // Verifying Token with JWT Secret
    try {
      userDetails = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.clearCookie('jwt');
      return next(new ErrorHandler(403, 'JWT Token is invalid'));
    }

    // Checking if userType is valid
    if (userDetails.userType !== userType) {
      return next(new ErrorHandler(403, 'Forbidden Route'));
    }

    // Validating Admin userId if user is admin
    if (userType === 'admin') {
      if (userDetails.userId !== process.env.ADMIN_ID) {
        res.clearCookie('jwt');
        return next(new ErrorHandler(400, 'JWT Token has Expired'));
      }
      req.user = { designation: 'Admin' };
      return next();
    }

    // Finding the authenticated user
    const user = await userModel.findOne({ _id: userDetails.userId });

    // Checking if a user exist
    if (!user) {
      res.clearCookie('jwt');
      return next(new ErrorHandler(401, `This ${userType} does not exist in database`));
    }

    // Storing user data to req.user
    req.user = user;
    return next();
  };
};

module.exports = authentication;
