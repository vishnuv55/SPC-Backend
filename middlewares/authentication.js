/* eslint-disable no-console */
const student = require('../models/student');
const execom = require('../models/execom');
const jwt = require('jsonwebtoken');

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
      console.log('jwt token missing');
      return next();
    }

    // Verifying Token with JWT Secret
    try {
      userDetails = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.clearCookie('jwt');
      console.log('invalid jwt token');
      return next();
    }

    // Checking if userType is valid
    if (userDetails.userType !== userType) {
      console.log('forbidden route');
      return next();
    }

    // Validating Admin userId if user is admin
    if (userType === 'admin') {
      if (userDetails.userId !== process.env.ADMIN_USER_ID) {
        res.clearCookie('jwt');
        console.log('jwt token expired');
      }
      return next();
    }

    // Finding the authenticated user
    const user = await userModel.findOne({ _id: userDetails.user_id });

    // Checking if a user exist
    if (!user) {
      res.clearCookie('jwt');
      console.log('user does not exist');
      return next();
    }

    // Storing user data to req.user
    req.user = user;
    return next();
  };
};

module.exports = authentication;
