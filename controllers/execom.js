const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Execom = require('../models/Execom');
const { ErrorHandler } = require('../helpers/error');
const { getFutureDate } = require('../helpers/date');
const { validateString, validatePassword } = require('../helpers/validation');

// Login

const login = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Fetching data from request body

  const { designation, password } = req.body;

  try {
    validateString(designation, 5, 50, 'Designation', true);
    validatePassword(password, 'Password', true);
  } catch (error) {
    return next(error);
  }
  try {
    const currentUser = await Execom.findOne({ designation });
    if (!currentUser) {
      throw new ErrorHandler(404, 'Designation not found');
    }
    // Comparing password

    const isPasswordMatch = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordMatch) {
      throw new ErrorHandler(401, 'Password does not match');
    }
    const cookieExpiryDate = getFutureDate(60);
    const { JWT_SECRET } = process.env;
    // For signing JWT token
    const token = jwt.sign({ user_type: 'execom', userId: currentUser._id }, JWT_SECRET); // eslint-disable-line
    // For setting httpOnly cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      expires: cookieExpiryDate,
    });
    res.status(200).json({ message: 'Successfully Logged In' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login };
