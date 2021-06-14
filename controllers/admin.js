/**
 * << Controller to handle admin specific functionalities >>
 *
 * Login -> 35
 * createStudent -> 66
 * addNewDrive -> 121
 * getDrives -> 169
 * updateStudentPassword -> 186
 * updateExecomPassword -> 222
 * deleteDrive -> 261
 * getRegisteredStudents -> 279
 *
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = require('../models/student');
const Drive = require('../models/drive');
const Execom = require('../models/execom');
const Alumni = require('../models/alumni');
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
  validateBranch,
  validatePassOutYear,
  validateArray,
} = require('../helpers/validation');

const login = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  const { password } = req.body;
  // To validate data in request object
  try {
    validateString(password, 6, 50, 'password', true);
  } catch (error) {
    return next(error);
  }
  try {
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
    return next(error);
  }
};

const createStudent = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // get data from req
  const { register_number, name, email, branch, pass_out_year } = req.body;

  // validate Data
  try {
    validateString(register_number, 5, 20, 'Register Number', true);
    validateName(name, 'Name', true);
    validateEmail(email, 'Email ID', true);
    validateBranch(branch, 'Branch');
    validatePassOutYear(pass_out_year);
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
    branch,
    pass_out_year,
    password: hashedPassword,
  });

  // Saving Student to database
  try {
    await student.save();
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving Student to database'));
  }
  res.status(201).json({ message: 'Student Created' });
};

const createStudents = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  const studentsArray = req.body;

  try {
    validateArray(studentsArray, 1, 2000, 'Student Data', false);
  } catch (error) {
    return next(error);
  }

  let studentEmails = [];
  let studentRegisterNumbers = [];
  try {
    studentEmails = await Student.find({}).distinct('email');
    studentRegisterNumbers = await Student.find({}).distinct('register_number');
  } catch (error) {
    return next(new ErrorHandler(500, 'Error Finding data in database'));
  }

  let updatedArray = [];
  try {
    updatedArray = await Promise.all(
      studentsArray.map(async (student) => {
        const [register_number, name, email, branch, pass_out_year] = student;

        // eslint-disable-next-line radix
        const pass_out_year_number = parseInt(pass_out_year);

        validateString(register_number, 5, 20, 'Register Number', true);
        validateName(name, 'Name', true);
        validateEmail(email, 'Email ID', true);
        validateBranch(branch, 'Branch');
        validatePassOutYear(pass_out_year_number);

        if (studentEmails.includes(email)) {
          throw new ErrorHandler(
            409,
            `Student with email : ${email} already exists in Database OR file has duplicate emails`
          );
        }
        studentEmails.push(email);

        if (studentRegisterNumbers.includes(register_number)) {
          throw new ErrorHandler(
            409,
            `Student with Register Number : ${register_number} already exists OR file has duplicate Register Numbers `
          );
        }
        studentRegisterNumbers.push(register_number);

        // Hashing register number for password
        let hashedPassword;
        try {
          hashedPassword = await bcrypt.hash(register_number, 8);
        } catch (error) {
          throw new ErrorHandler(500, 'Error hashing password');
        }
        return {
          _id: mongoose.Types.ObjectId(),
          register_number,
          name,
          email,
          branch,
          pass_out_year: pass_out_year_number,
          password: hashedPassword,
        };
      })
    );
  } catch (error) {
    return next(error);
  }

  try {
    await Student.insertMany(updatedArray);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving Student to database'));
  }

  res.status(201).json({ message: 'Students Created' });
};

const addNewDrive = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Get data from req.body
  const {
    company_name,
    position,
    description,
    contact_email,
    drive_date,
    location,
    url,
    salary,
    requirements,
  } = req.body;

  // validate data
  try {
    validateString(company_name, 3, 100, 'Company Name', true);
    validateString(position, 3, 30, 'Position', true);
    validateString(description, 3, 128, 'Description', true);
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
    created_date: new Date().toISOString(),
    company_name,
    position,
    contact_email,
    description,
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
  res.status(201).json({ message: 'Drive saved successfully' });
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
  res.status(200).json({ message: 'Drive deleted successfully' });
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
    'name',
    'register_number',
    branch && 'branch',
    gender && 'gender',
    dob && 'date_of_birth',
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
  res.status(200).json(students);
};

const createAlumni = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { pass_out_year } = req.body;
  try {
    validatePassOutYear(pass_out_year);
  } catch (error) {
    return next(error);
  }

  const student = await Student.find({ pass_out_year }).select('name email address phone_number');
  if (!student) {
    return next(new ErrorHandler(500, 'Unable to find Student Details'));
  }
  try {
    await Alumni.insertMany(student);
  } catch (error) {
    return next(new ErrorHandler(500, 'Unable to Create Alumni'));
  }
  res.status(200).json({ message: 'Alumni details created successfully' });
};
const getAlumniDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const alumni = await Alumni.aggregate([
    {
      $addFields: {
        address: {
          $concat: ['$address.line_one', ', ', '$address.line_two', ', ', '$address.state'],
        },
        Pin: {
          $add: ['$address.zip'],
        },
      },
    },
    {
      $project: {
        __v: 0,
        _id: 0,
      },
    },
  ]);
  if (!alumni) {
    return next(new ErrorHandler(500, 'Unable to find Alumni Details'));
  }
  res.status(200).json(alumni);
};
module.exports = {
  login,
  createStudent,
  createStudents,
  addNewDrive,
  getDrives,
  deleteDrive,
  updateStudentPassword,
  updateExecomPassword,
  getRegisteredStudents,
  createAlumni,
  getAlumniDetails,
};
