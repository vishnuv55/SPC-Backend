const { ErrorHandler } = require('../helpers/error');
const {
  validateMongooseId,
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
} = require('../helpers/validation');

const editProfile = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting data from req body
  const {
    id,
    name,
    branch,
    date_of_birth,
    gender,
    tenth_mark,
    plus_two_mark,
    btech_cgpa,
    number_of_backlogs,
    email,
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
    validateMongooseId(id, 'Id', true);
    validateName(name);
    validateString(branch, 2, 100, 'Branch');
    validateDateOfBirth(date_of_birth, 16);
    validateGender(gender);
    validateString(tenth_mark, 1, 10, '10th mark');
    validateString(plus_two_mark, 1, 10, '12th mark');
    validateString(btech_cgpa, 1, 10, 'BTech CGPA');
    validateNumber(number_of_backlogs, 0, 50, 'Number of backlogs');
    validateEmail(email);
    validatePhone(phone_number);
    validateString(address, 50, 1000, 'Address');
    validateString(linkedin, 5, 100, 'LinkedIn URL');
    validateString(twitter, 5, 100, 'Twitter URL');
    validateString(github, 5, 100, 'Github URL');
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
  if (branch !== undefined) req.user.branch = branch;
  if (date_of_birth !== undefined) req.user.date_of_birth = date_of_birth;
  if (gender !== undefined) req.user.gender = gender;
  if (tenth_mark !== undefined) req.user.tenth_mark = tenth_mark;
  if (plus_two_mark !== undefined) req.user.plus_two_mark = plus_two_mark;
  if (btech_cgpa !== undefined) req.user.btech_cgpa = btech_cgpa;
  if (number_of_backlogs !== undefined) req.user.number_of_backlogs = number_of_backlogs;
  if (email !== undefined) req.user.email = email;
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

module.exports = { editProfile };
