const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = require('../models/student');
const { getFutureDate } = require('../helpers/date');
const { ErrorHandler } = require('../helpers/error');
const { validateString, validateName, validateEmail } = require('../helpers/validation');

// Login controller
const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    // To validate data in request object
    validateString(password, 6, 50, 'password', true);

    const { ADMIN_PASSWORD, ADMIN_ID } = process.env;
    const isPasswordMatch = await bcrypt.compare(password, ADMIN_PASSWORD);

    if (isPasswordMatch) {
      const { JWT_SECRET } = process.env;

      // For signing JWT token
      const token = jwt.sign({ userType: 'admin', userId: ADMIN_ID }, JWT_SECRET);

      // For setting httpOnly cookie
      const cookieExpiryDate = getFutureDate(30);
      res.cookie('jwt', token, {
        httpOnly: true,
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

const createStudent = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // get data from req
  const { register_number, name, email } = req.body;

  // validate Data
  try {
    validateString(register_number, 5, 20, 'Register Number', true);
    validateName(name, 'Name', true);
    validateEmail(email, 'Email ID', true);
  } catch (error) {
    return next(error);
  }

  // Checking if another student with Register Number exist
  const doesRegisterNumberExist = await Student.exists({ register_number });
  if (doesRegisterNumberExist) {
    return next(new ErrorHandler(409, 'Student with Register Number already exist'));
  }

  // Checking if another student with Register Number exist
  const doesEmailExist = await Student.exists({ email });
  if (doesEmailExist) {
    return next(new ErrorHandler(409, 'Student with email already exist'));
  }

  // Hashing register number for password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(register_number, 8);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error hashing password'));
  }

  // Creating New Student data
  const student = new Student({
    _id: mongoose.Types.ObjectId(),
    register_number,
    name,
    email,
    password: hashedPassword,
  });

  // Saving Student to database
  try {
    await student.save();
  } catch (error) {
    return next(ErrorHandler(500, 'Error saving Student to database'));
  }
  res.status(400).json({ message: 'Student Created' });
};

module.exports = { login, createStudent };
