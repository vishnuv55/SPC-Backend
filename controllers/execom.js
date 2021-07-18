/**
 *
 *
 *
 * Controllers to handles all Execom specific functions
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 *
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Drive = require('../models/drive');
const Execom = require('../models/execom');
const { ErrorHandler } = require('../helpers/error');
const { getFutureDate } = require('../helpers/date');
const { validateString, validatePassword } = require('../helpers/validation');

/**
 *
 *
 * Controller for execom login
 *
 */
const login = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Fetching data from request body
  const { designation, password } = req.body;

  // Validating data
  try {
    validateString(designation, 3, 50, 'Designation', true);
    validatePassword(password, 'Password', true);
  } catch (error) {
    return next(error);
  }

  // Finding student by designation
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
    const token = jwt.sign({ userType: 'execom', userId: currentUser._id }, JWT_SECRET); // eslint-disable-line

    // For setting httpOnly cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      expires: cookieExpiryDate,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({ message: 'Successfully Logged In' });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 *
 * Controller to send drives details for execom
 *
 */
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

  res.status(200).json(drives);
};

module.exports = { login, getDrives };
