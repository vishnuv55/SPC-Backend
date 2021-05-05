const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = require('../models/student');
const Drive = require('../models/drive');
const Execom = require('../models/execom');
const { getFutureDate } = require('../helpers/date');
const { ErrorHandler } = require('../helpers/error');
const {
  validateString,
  validateName,
  validateEmail,
  validateDate,
  validateMarks,
  validateNumber,
  validateUrl,
  validatePassword,
  validateMongooseId,
  validateBoolean,
  validateGenderArray,
} = require('../helpers/validation');

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
    return next(new ErrorHandler(500, 'Error saving Student to database'));
  }
  res.status(200).json({ message: 'Student Created' });
};

const addNewDrive = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Get data from req.body
  const { company_name, contact_email, drive_date, location, url, salary, requirements } = req.body;

  // validate data
  try {
    validateString(company_name, 3, 100, 'Company Name', true);
    validateEmail(contact_email, 'Contact Email', true);
    validateDate(drive_date, 'Drive Date', true);
    validateString(location, 3, 100, 'Location', true);
    validateString(salary, 2, 50, 'Salary', true);
    validateUrl(url, 'URL', true);
    validateGenderArray(requirements.gender, 'Preferred gender', true);
    validateMarks(requirements.plus_two_mark, '+2 mark', true);
    validateMarks(requirements.tenth_mark, '10th mark', true);
    validateNumber(requirements.btech_min_cgpa, 0, 100, 'Minimum CGPA', true);
    validateNumber(requirements.number_of_backlogs, 0, 50, 'Number of backlogs', true);
  } catch (error) {
    return next(error);
  }

  // creating new drive data
  const drive = new Drive({
    _id: mongoose.Types.ObjectId(),
    company_name,
    contact_email,
    drive_date: new Date(drive_date),
    location,
    salary,
    url,
    requirements,
  });

  // Saving drive to database
  try {
    await drive.save();
  } catch (err) {
    return next(new ErrorHandler(500, 'Error saving Student to database'));
  }

  // Sending success response
  res.status(200).json({ message: 'Drive saved successfully' });
};

const getDrives = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting all drives from database
  let drives;
  try {
    drives = await Drive.find({});
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding Drives'));
  }

  // Sending drives as response
  res.status(200).json(drives);
};

const updateStudentPassword = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting data from req.body
  const { email, password } = req.body;

  // validate Data
  try {
    validateEmail(email, 'Email ID', true);
    validatePassword(password, 'Password', true);
  } catch (error) {
    return next(error);
  }

  // Hashing password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 8);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error hashing password'));
  }

  // Finding and updating student password
  const updatePassword = await Student.findOneAndUpdate({ email }, { password: hashedPassword });

  // Checking if user exist
  if (!updatePassword) {
    return next(new ErrorHandler(400, 'Student with the email does not exist'));
  }

  // Sending success response
  res.status(200).json({ message: 'Password changed successfully' });
};

const updateExecomPassword = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting data from req.body
  const { designation, password } = req.body;

  // validate Data
  try {
    validateString(designation, 5, 50, 'Designation', true);
    validatePassword(password, 'Password', true);
  } catch (error) {
    return next(error);
  }

  // Hashing password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 8);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error hashing password'));
  }

  // Finding and updating execom password
  const updatePassword = await Execom.findOneAndUpdate(
    { designation },
    { password: hashedPassword }
  );

  // Checking if user exist
  if (!updatePassword) {
    return next(new ErrorHandler(400, 'Execom with the designation does not exist'));
  }

  // Sending success response
  res.status(200).json({ message: 'Password changed successfully' });
};
const deleteDrive = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { id: driveId } = req.params;
  try {
    validateMongooseId(driveId, 'Id', true);
  } catch (error) {
    return next(error);
  }

  const drive = await Drive.findOneAndDelete({ _id: driveId });
  if (!drive) {
    return next(new ErrorHandler(500, 'Error deleting Drive'));
  }
  res.status(201).json({ message: 'Drive deleted successfully' });
};

const getRegisteredStudents = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Fetching data from request
  const {
    id,
    branch,
    gender,
    dob,
    tenth_mark,
    plus_two_mark,
    btech_cgpa,
    number_of_backlogs,
    email,
    phone_number,
  } = req.body;
  try {
    validateMongooseId(id, 'ID', true);
    validateBoolean(branch, 'Branch', true);
    validateBoolean(gender, 'Gender', true);
    validateBoolean(dob, 'Date of Birth', true);
    validateBoolean(tenth_mark, 'Tenth Mark', true);
    validateBoolean(plus_two_mark, 'Plus Two Mark', true);
    validateBoolean(btech_cgpa, 'Btech CGPA', true);
    validateBoolean(number_of_backlogs, 'Number of Backlogs', true);
    validateBoolean(email, 'Email', true);
    validateBoolean(phone_number, 'Phone Number', true);
  } catch (error) {
    return next(error);
  }
  const requirements = [
    branch && 'branch',
    gender && 'gender',
    dob && 'dob',
    tenth_mark && 'tenth_mark',
    plus_two_mark && 'plus_two_mark',
    btech_cgpa && 'btech_cgpa',
    number_of_backlogs && 'number_of_backlogs',
    email && 'email',
    phone_number && 'phone_number',
  ];
  const { registered_students } = await Drive.findOne({ _id: id });
  if (!registered_students) {
    return next(new ErrorHandler(500, 'Unable to Locate Drive'));
  }
  const students = await Student.find({ register_number: { $in: registered_students } }).select(
    requirements
  );
  if (!students) {
    return next(new ErrorHandler(500, 'Unable to find Student Details'));
  }
  res.status(201).json(students);
};
module.exports = {
  login,
  createStudent,
  addNewDrive,
  getDrives,
  deleteDrive,
  updateStudentPassword,
  updateExecomPassword,
  getRegisteredStudents,
};
