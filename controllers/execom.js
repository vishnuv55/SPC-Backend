/**
 * << Controller to handle execom specific functionalities >>
 *
 * login -> 15
 * getDrives -> 59
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Drive = require('../models/drive');
const Execom = require('../models/execom');
const { ErrorHandler } = require('../helpers/error');
const { getFutureDate } = require('../helpers/date');
const { validateString, validatePassword } = require('../helpers/validation');

const login = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Fetching data from request body

  const { designation, password } = req.body;

  try {
    validateString(designation, 3, 50, 'Designation', true);
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
    const { JWT_SECRET, NODE_ENV } = process.env;
    const isProduction = NODE_ENV === 'production';
    // For signing JWT token
    const token = jwt.sign({ userType: 'execom', userId: currentUser._id }, JWT_SECRET); // eslint-disable-line
    // For setting httpOnly cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      expires: cookieExpiryDate,
      secure: isProduction,
      sameSite: 'none',
    });
    res.status(200).json({ message: 'Successfully Logged In' });
  } catch (error) {
    return next(error);
  }
};

const getDrives = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting all drives from database
  let drives;
  try {
    drives = await Drive.find({}).sort({ created_date: -1 });
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding Drives'));
  }

  // Sending drives as response
  res.status(200).json(drives);
};

module.exports = { login, getDrives };
