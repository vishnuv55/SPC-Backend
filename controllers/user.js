const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../helpers/error');
const { validatePassword } = require('../helpers/validation');

const changePassword = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  const { current_password, new_password } = req.body;

  try {
    validatePassword(current_password, 'Current Password', true);
    validatePassword(new_password, 'New Password', true);
  } catch (error) {
    return next(error);
  }

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

  req.user.password = hashedPassword;
  try {
    await req.user.save();
  } catch (error) {
    return next(new ErrorHandler(500, 'Error saving password'));
  }

  res.status(200).json({ message: 'Password Successfully changed' });
};

const logout = async (req, res, next) => {
  if (req.error) {
    return next(req.error);
  }

  res.clearCookie('jwt');
  res.status(200).json({ message: 'Successfully logged out' });
};

module.exports = { changePassword, logout };
