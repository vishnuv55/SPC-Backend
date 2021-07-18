/**
 *
 *
 *
 * Controllers to handles all admin specific functions
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Student = require('../models/student');
const Drive = require('../models/drive');
const Execom = require('../models/execom');
const {
  validateUrl,
  validateName,
  validateDate,
  validateArray,
  validateEmail,
  validateMarks,
  validateBranch,
  validateString,
  validateNumber,
  validateBoolean,
  validatePassword,
  validateMongooseId,
  validateGenderArray,
  validatePassOutYear,
} = require('../helpers/validation');
const Alumni = require('../models/alumni');
const Placement = require('../models/placement');
const { getFutureDate } = require('../helpers/date');
const { ErrorHandler } = require('../helpers/error');
const sendNewMail = require('../helpers/sendNewMail');
const CreateAccountMsg = require('../helpers/account-created-alert');

/**
 *
 *
 * Login controller for admin, accept password and set httpOnly cookie
 *
 */
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
        secure: true,
        sameSite: 'none',
      });

      res.status(200).json({ message: 'Successfully Logged In' });
    } else {
      throw new ErrorHandler(401, 'Password does not match');
    }
  } catch (error) {
    return next(error);
  }
};

/**
 *
 *
 * Controller to create a single student
 *
 */
const createStudent = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Get data from req
  const { register_number, name, email, branch, pass_out_year } = req.body;

  // Validate Data
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

  const response = await sendNewMail(email, 'Your Account is Created', CreateAccountMsg);
  if (!response.success) {
    return next(new ErrorHandler(500, 'Student account created but sending email failed'));
  }

  res.status(201).json({ message: 'Student Created' });
};

/**
 *
 *
 * Controller to create multiple students using a CSV file
 *
 */
const createStudents = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  const studentsArray = req.body;
  // Validating reg Data
  try {
    validateArray(studentsArray, 1, 2000, 'Student Data', false);
  } catch (error) {
    return next(error);
  }

  let studentEmails = [];
  let studentRegisterNumbers = [];
  const newEmails = [];

  // Fetching distinct reg numbers, emails from database
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

        // Checking email already exists

        if (studentEmails.includes(email)) {
          throw new ErrorHandler(
            409,
            `Student with email : ${email} already exists in Database OR file has duplicate emails`
          );
        }
        studentEmails.push(email);
        newEmails.push(email);

        // Checking register number already exists

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

  // Inserting students to database

  try {
    await Student.insertMany(updatedArray);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving Student to database'));
  }

  // Creating a String of emails to send email alert
  const mails = newEmails.join(', ');

  // Sending emails to students about their account creation
  const response = await sendNewMail(mails, 'Your Account is Created', CreateAccountMsg);
  if (!response.success) {
    return next(new ErrorHandler(500, 'Student account created but sending email failed'));
  }

  res.status(201).json({ message: 'Students Created' });
};

/**
 *
 *
 * Controller to create a new Placement drive
 *
 */
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
    validateString(description, 20, 200, 'Description', true);
    validateEmail(contact_email, 'Contact Email', true);
    validateDate(drive_date, 'Drive Date', true);
    validateString(location, 3, 100, 'Location', true);
    validateString(salary, 3, 50, 'Salary', true);
    validateUrl(url, 'URL', true);
    validateGenderArray(requirements.gender, 'Preferred gender', true);
    validateMarks(requirements.plus_two_mark, '+2 mark', true);
    validateMarks(requirements.tenth_mark, '10th mark', true);
    validateNumber(requirements.btech_min_cgpa, 0, 10, 'Minimum CGPA', true);
    validateNumber(requirements.number_of_backlogs, 0, 57, 'Number of backlogs', true);
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

  res.status(201).json({ message: 'Drive saved successfully' });
};

/**
 *
 *
 * Controller to send Placement drive details to client
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

/**
 *
 *
 * Controller to Update student password
 *
 */
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

  res.status(200).json({ message: 'Password changed successfully' });
};

/**
 *
 *
 * Controller to Update Execom password
 *
 */
const updateExecomPassword = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting data from req.body
  const { designation, password } = req.body;

  // validate Data
  try {
    validateString(designation, 3, 50, 'Designation', true);
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

  res.status(200).json({ message: 'Password changed successfully' });
};

/**
 *
 *
 * Controller to Delete Placement drives
 *
 */
const deleteDrive = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Fetching data from request
  const { id: driveId } = req.params;

  // Validating req Data
  try {
    validateMongooseId(driveId, 'Id', true);
  } catch (error) {
    return next(error);
  }

  // Finding and deleting drive
  const drive = await Drive.findOneAndDelete({ _id: driveId });
  if (!drive) {
    return next(new ErrorHandler(500, 'Error deleting Drive'));
  }

  res.status(200).json({ message: 'Drive deleted successfully' });
};

/**
 *
 *
 * Controller to send details Registration Information to client
 *
 */
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

  // Validating req Data
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

  // Creating requirements list
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

  // Fetching student details from drive
  const { registered_students } = await Drive.findOne({ _id: id });
  if (!registered_students) {
    return next(new ErrorHandler(500, 'Unable to Locate Drive'));
  }

  // Selecting student details
  const students = await Student.find({ register_number: { $in: registered_students } }).select(
    requirements
  );
  if (!students) {
    return next(new ErrorHandler(500, 'Unable to find Student Details'));
  }

  res.status(200).json(students);
};

/**
 *
 *
 * Controller to create alumni
 *
 */
const createAlumni = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting pass out year from request
  const { pass_out_year } = req.body;

  // Validating the pass out year
  try {
    validatePassOutYear(pass_out_year);
  } catch (error) {
    return next(error);
  }

  // Getting all students in the obtained year
  const student = await Student.find({ pass_out_year }).select(
    'name email  phone_number placement_status placed_company ctc'
  );
  // Sending error is no student exist in the obtained error
  if (!student) {
    return next(new ErrorHandler(500, 'Unable to find Student Details'));
  }

  // Saving data to alumni
  try {
    await Alumni.insertMany(student);
  } catch (error) {
    return next(new ErrorHandler(500, 'Unable to Create Alumni'));
  }

  res.status(200).json({ message: 'Alumni details created successfully' });
};

/**
 *
 *
 * Controller to send alumni details to client
 *
 */
const getAlumniDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  let alumni;

  // Fetching Alumni data from database
  try {
    alumni = await Alumni.aggregate([
      {
        $project: {
          __v: 0,
          _id: 0,
        },
      },
    ]);
  } catch (error) {
    return next(new ErrorHandler(500, 'Unable Fetch alumni details'));
  }

  // Sending error if alumni not exists
  if (!alumni) {
    return next(new ErrorHandler(500, 'Unable to find Alumni Details'));
  }

  // Sending error if No alumni selected
  if (alumni.length === 0) {
    return next(new ErrorHandler(500, 'No Alumni Details Found '));
  }

  res.status(200).json(alumni);
};

/**
 *
 *
 * Controller to send Placement details to client
 *
 */
const getPlacedStudents = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting pass out year from request
  const { pass_out_year } = req.body;

  // Validating the pass out year
  try {
    validatePassOutYear(pass_out_year);
  } catch (error) {
    return next(error);
  }

  // Getting the Placed student details from database
  const placedStudents = await Placement.find({ pass_out_year }).select('-_id -__v');

  // Sending error if student details does not exist
  if (!placedStudents) {
    return next(new ErrorHandler(500, 'Unable to find Placed Students'));
  }

  // Sending error if student is empty
  if (placedStudents.length === 0) {
    return next(new ErrorHandler(500, 'No placed students for this year'));
  }

  res.status(200).json(placedStudents);
};
/**
 *
 *
 * Controller to send Student details to client
 *
 */

const getStudents = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting data from request
  const { pass_out_year, branch } = req.body;

  // Validating data
  try {
    validateBranch(branch, 'Branch', true);
    validatePassOutYear(pass_out_year);
  } catch (error) {
    return next(error);
  }

  // finding the student details
  const students = await Student.find({ branch, pass_out_year }).select('-password -__v');

  // Sending error if student is empty
  if (students.length === 0) {
    return next(new ErrorHandler(500, 'No students available based on the given criterion '));
  }

  // Sending error if find returns error
  if (!students) {
    return next(new ErrorHandler(500, 'Unable to find Students'));
  }

  res.status(200).json(students);
};

/**
 *
 *
 * Controller to delete student
 *
 */
const deleteStudent = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Getting id from request
  const { id: studentId } = req.params;

  // Validating id
  try {
    validateMongooseId(studentId, 'Id', true);
  } catch (error) {
    return next(error);
  }

  // finding and deleting student
  const student = await Student.findOneAndDelete({ _id: studentId });

  // Sending error if delete is unsuccessful
  if (!student) {
    return next(new ErrorHandler(500, 'Error deleting Student'));
  }

  res.status(200).json({ message: 'Student deleted successfully' });
};

/**
 *
 *
 * Controller to send Year wise Placement details to client
 *
 */
const getPlacementYearWiseReport = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  let yearWiseReport;
  try {
    // Fetching year wise placement data
    yearWiseReport = await Placement.aggregate([
      { $group: { _id: '$pass_out_year', Placements: { $sum: 1 } } },
    ]);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error generating reporting'));
  }

  res.status(200).json(yearWiseReport);
};

module.exports = {
  login,
  getDrives,
  addNewDrive,
  deleteDrive,
  getStudents,
  createAlumni,
  createStudent,
  deleteStudent,
  createStudents,
  getAlumniDetails,
  getPlacedStudents,
  updateExecomPassword,
  updateStudentPassword,
  getRegisteredStudents,
  getPlacementYearWiseReport,
};
