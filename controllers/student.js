/**
 * << Controller to handle student specific functionalities >>
 *
 * editProfile -> 35
 * login -> 119
 * getStudentDetails -> 158
 * registerDrive -> 168
 * getDrives -> 210
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Drive = require('../models/drive');
const { ErrorHandler } = require('../helpers/error');
const { getFutureDate } = require('../helpers/date');
const {
  validateName,
  validateString,
  validateDateOfBirth,
  validateGender,
  validateNumber,
  validateEmail,
  validatePhone,
  validateBoolean,
  validateStringArray,
  validateProjects,
  validatePassword,
  validateMarks,
  validateUrl,
  validateAddress,
  validateMongooseId,
} = require('../helpers/validation');

const editProfile = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting data from req body
  const {
    name,
    date_of_birth,
    gender,
    tenth_mark,
    plus_two_mark,
    btech_cgpa,
    number_of_backlogs,
    phone_number,
    address,
    linkedin,
    twitter,
    github,
    guardian_name,
    guardian_contact_number,
    placement_status,
    placed_company,
    projects,
    programming_languages,
  } = req.body;

  // Validating each data
  try {
    validateName(name);
    validateDateOfBirth(date_of_birth, 16);
    validateGender(gender);
    validateMarks(tenth_mark, '10th mark');
    validateMarks(plus_two_mark, '12th mark');
    validateNumber(btech_cgpa, 0, 100, 'BTech CGPA');
    validateNumber(number_of_backlogs, 0, 50, 'Number of backlogs');
    validatePhone(phone_number);
    validateAddress(address, 'Address');
    validateUrl(linkedin, 'LinkedIn URL');
    validateUrl(twitter, 'Twitter URL');
    validateUrl(github, 'Github URL');
    validateName(guardian_name, 'Guardian Name');
    validatePhone(guardian_contact_number, 'Guardian Contact Number');
    validateBoolean(placement_status, 'Placement Status');
    validateString(placed_company, 3, 100, 'Placed Company');
    validateProjects(projects);
    validateStringArray(programming_languages, 3, 100, 'Programming Languages');
  } catch (error) {
    return next(error);
  }

  // Updating data to req.user
  if (name !== undefined) req.user.name = name;
  if (date_of_birth !== undefined) req.user.date_of_birth = date_of_birth;
  if (gender !== undefined) req.user.gender = gender;
  if (tenth_mark !== undefined) req.user.tenth_mark = tenth_mark;
  if (plus_two_mark !== undefined) req.user.plus_two_mark = plus_two_mark;
  if (btech_cgpa !== undefined) req.user.btech_cgpa = btech_cgpa;
  if (number_of_backlogs !== undefined) req.user.number_of_backlogs = number_of_backlogs;
  if (phone_number !== undefined) req.user.phone_number = phone_number;
  if (address !== undefined) req.user.address = address;
  if (twitter !== undefined) req.user.twitter = twitter;
  if (github !== undefined) req.user.github = github;
  if (linkedin !== undefined) req.user.linkedin = linkedin;
  if (guardian_name !== undefined) req.user.guardian_name = guardian_name;
  if (guardian_contact_number !== undefined)
    req.user.guardian_contact_number = guardian_contact_number;
  if (placement_status !== undefined) req.user.placement_status = placement_status;
  if (placed_company !== undefined) req.user.placed_company = placed_company;
  if (projects !== undefined) req.user.projects = projects;
  if (programming_languages !== undefined) req.user.programming_languages = programming_languages;

  // Saving data to database
  try {
    await req.user.save();
  } catch (err) {
    return next(new ErrorHandler(500, 'Error Updating Student data'));
  }
  res.status(200).json({ message: 'Student Profile Updated Successfully' });
};

const login = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Fetching data from request body
  const { email, password } = req.body;

  // Validating data received from request
  try {
    validatePassword(password, 'Password', true);
    validateEmail(email, 'Email', true);
  } catch (error) {
    return next(error);
  }
  try {
    const currentUser = await Student.findOne({ email });
    if (!currentUser) {
      throw new ErrorHandler(404, 'Email not found');
    }
    // Comparing password
    const isPasswordMatch = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordMatch) {
      throw new ErrorHandler(401, 'Password does not match');
    }
    const cookieExpiryDate = getFutureDate(60);

    const { JWT_SECRET } = process.env;

    // For signing JWT token
    const token = jwt.sign({ userType: 'student', userId: currentUser._id }, JWT_SECRET); // eslint-disable-line
    // For setting httpOnly cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      expires: cookieExpiryDate,
    });
    res.status(200).json({ message: 'Successfully Logged In' });
  } catch (error) {
    return next(error);
  }
};

const getStudentDetails = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Splitting confidential data from req,user
  const { password, __v, ...studentData } = req.user.toObject();

  res.status(200).json(studentData);
};

const registerDrive = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Getting id from req body
  const { id } = req.body;

  // Validating id
  try {
    validateMongooseId(id, 'Drive ID', true);
  } catch (error) {
    return next(error);
  }

  // Getting student register number from req.user
  const { register_number } = req.user;

  // Finding drive
  const drive = await Drive.findById(id);
  if (!drive) {
    return next(new ErrorHandler(500, 'Error finding Drive'));
  }

  // Checking if student is already registered
  const isStudentRegistered = drive.registered_students.includes(register_number);
  if (isStudentRegistered) {
    return next(new ErrorHandler(403, 'You are already registered'));
  }

  // Updating student list in drive
  drive.registered_students.push(register_number);

  // Saving updates to database
  try {
    await drive.save();
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving to database'));
  }
  // Sending success response
  res.status(200).json({ message: 'Successfully registered to drive' });
};

const getDrives = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { tenth_mark, plus_two_mark, gender, number_of_backlogs, btech_cgpa } = req.user;
  // Checking query parameters.
  const query = {
    ...(number_of_backlogs && { 'requirements.number_of_backlogs': { $gte: number_of_backlogs } }),
    ...(tenth_mark.percentage && {
      'requirements.tenth_mark.percentage': { $lte: tenth_mark.percentage },
    }),
    ...(plus_two_mark.percentage && {
      'requirements.plus_two_mark.percentage': { $lte: plus_two_mark.percentage },
    }),
    ...(btech_cgpa && { 'requirements.btech_min_cgpa': { $lte: btech_cgpa } }),
    ...(gender && { 'requirements.gender': { $in: gender } }),
  };

  const drives = await Drive.find(query);
  if (!drives) {
    return next(new ErrorHandler(500, 'No drives available'));
  }
  res.status(200).json(drives);
};
module.exports = { editProfile, login, getStudentDetails, registerDrive, getDrives };
