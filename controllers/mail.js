const { ErrorHandler } = require('../helpers/error');
const sendNewMail = require('../helpers/sendNewMail');
const { validateString } = require('../helpers/validation');
const Student = require('../models/student');

const sendMail = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Getting subject and content from req body
  const { subject, content } = req.body;

  // Validating student details
  try {
    validateString(subject, 5, 400, 'Subject', true);
    validateString(content, 5, 5000, 'Content', true);
  } catch (error) {
    return next(error);
  }

  // getting emails of all students
  const emails = await (await Student.distinct('email')).join(', ');

  // Sending emails to all students
  const response = await sendNewMail(emails, subject, content);

  // Checking if response is success
  if (!response.success) {
    return next(new ErrorHandler(500, response.errorMsg));
  }

  // Sending success response
  res.status(200).json({
    message: 'Mail has been successfully send',
    approved: response.approved,
    rejected: response.rejected,
  });
};

module.exports = { sendMail };
