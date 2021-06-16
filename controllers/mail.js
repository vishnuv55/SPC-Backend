const { ErrorHandler } = require('../helpers/error');
const sendNewMail = require('../helpers/sendNewMail');
const {
  validateString,
  validateNumber,
  validateBranchArray,
  validateGenderArray,
} = require('../helpers/validation');
const Student = require('../models/student');

const sendMail = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  // Getting subject and content from req body
  const {
    branch_list,
    number_of_backlogs,
    tenth_mark,
    plus_two_mark,
    btech_cgpa,
    gender_list,
    subject,
    content,
  } = req.body;

  // Validating student details
  try {
    validateBranchArray(branch_list, 'Branches', false);
    validateNumber(number_of_backlogs, 0, 57, 'Number of backlogs', false);
    validateNumber(tenth_mark, 0, 100, '10th mark', false);
    validateNumber(plus_two_mark, 0, 100, '12th mark', false);
    validateNumber(btech_cgpa, 0, 10, 'BTech CGPA', false);
    validateGenderArray(gender_list, 'Gender List', false);
    validateString(subject, 5, 128, 'Subject', true);
    validateString(content, 5, 10000, 'Content', true);
  } catch (error) {
    return next(error);
  }

  // Checking query parameters.
  const query = {
    ...(branch_list && { branch: { $in: branch_list } }),
    ...(number_of_backlogs && { number_of_backlogs: { $lte: number_of_backlogs } }),
    ...(tenth_mark && { 'tenth_mark.percentage': { $gt: tenth_mark } }),
    ...(plus_two_mark && { 'plus_two_mark.percentage': { $gt: plus_two_mark } }),
    ...(btech_cgpa && { btech_cgpa: { $gte: btech_cgpa } }),
    ...(gender_list && { gender: { $in: gender_list } }),
  };

  // Finding student that match the query and getting their emails
  const [queryResponse] = await Student.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        mail_ids: { $addToSet: '$email' },
      },
    },
  ]);

  // Sending error if student does not exist
  if (!queryResponse) {
    return next(new ErrorHandler(500, 'No eligible student'));
  }

  // Joining the mails to a form a string of all emails
  const mails = queryResponse.mail_ids.join(', ');

  // Sending emails to all students
  const response = await sendNewMail(mails, subject, content);

  // Checking if response is success
  if (!response.success) {
    return next(new ErrorHandler(500, response.errorMsg));
  }

  // Sending success response
  res.status(200).json({
    message: 'Mail has been successfully send',
    accepted: response.accepted,
    rejected: response.rejected,
  });
};

module.exports = { sendMail };
