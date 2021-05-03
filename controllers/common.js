const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/error');

const isUserLoggedIn = (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting cookie from req
  const token = req.cookies.jwt;

  //   Sending res if cookie does not exist
  if (!token) {
    return res.status(200).json({ is_user_logged_in: false });
  }

  try {
    // Getting user type for cookie
    const { userType } = jwt.verify(token, process.env.JWT_SECRET);

    // Sending user type as response
    res.status(200).json({ is_user_logged_in: true, user_type: userType });
  } catch (err) {
    return next(new ErrorHandler(403, 'JWT Token is invalid'));
  }
};

module.exports = { isUserLoggedIn };
