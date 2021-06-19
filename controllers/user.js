const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../helpers/error');
const { validatePassword } = require('../helpers/validation');

const changePassword = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  // Getting data from req.body
  const { current_password, new_password } = req.body;

  // Validating data
  try {
    validatePassword(current_password, 'Current Password', true);
    validatePassword(new_password, 'New Password', true);
  } catch (error) {
    return next(error);
  }

  // Checking if passwords match or not
  const doesPasswordMatch = await bcrypt.compare(current_password, req.user.password);
  if (!doesPasswordMatch) {
    return next(new ErrorHandler(401, 'Password does not match'));
  }

  // Hashing new password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(new_password, 8);
  } catch (error) {
    return next(new ErrorHandler(500, 'Error hashing password'));
  }

  // Saving password to database
  req.user.password = hashedPassword;
  try {
    await req.user.save();
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving password'));
  }

  // Sending success message
  res.status(200).json({ message: 'Password Successfully changed' });
};

const logout = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';
  // Clearing cookie
  res.clearCookie('jwt', {
    secure: isProduction,
    sameSite: 'none',
  });

  // Sending success message
  res.status(200).json({ message: 'Successfully logged out' });
};

module.exports = { changePassword, logout };
