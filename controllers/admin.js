const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getFutureDate } = require('../helpers/date');
const { ErrorHandler } = require('../helpers/error');
const { validateString } = require('../helpers/validation');

// Login controller
const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    // To validate data in request object
    try {
      validateString(password, 6, 50, 'password', true);
    } catch (err) {
      throw new ErrorHandler(400, err.message);
    }

    const { ADMIN_PASSWORD, ADMIN_ID } = process.env;

    const isPasswordMatch = await bcrypt.compare(password, ADMIN_PASSWORD);

    if (isPasswordMatch) {
      const { JWT_SECRET } = process.env;

      // For signing JWT token
      const token = jwt.sign({ user_type: 'admin', admin_id: ADMIN_ID }, JWT_SECRET);

      // For setting httpOnly cookie
      const cookieExpiryDate = getFutureDate(30);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        expires: cookieExpiryDate,
      });

      res.status(200).json({ message: 'Successfully Logged In' });
    } else {
      throw new ErrorHandler(401, 'Password does not match');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
