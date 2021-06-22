const express = require('express');
const { postQuery, getQueries, editQuestion } = require('../controllers/forum');
const {
  editProfile,
  login,
  getStudentDetails,
  registerDrive,
  getDrives,
  deRegisterDrive,
} = require('../controllers/student');
const { changePassword, logout } = require('../controllers/user');
const authenticateStudent = require('../middlewares/authentication')('student');

const router = express.Router();

router.get('/', authenticateStudent, getStudentDetails);
router.patch('/', authenticateStudent, editProfile);
router.post('/login', login);
router.get('/drive-details', authenticateStudent, getDrives);
router.post('/register-drive', authenticateStudent, registerDrive);
router.post('/change-password', authenticateStudent, changePassword);
router.post('/logout', authenticateStudent, logout);
router.post('/forum/question', authenticateStudent, postQuery);
router.get('/forum/queries', authenticateStudent, getQueries);
router.patch('/forum/question', authenticateStudent, editQuestion);
router.post('/deregister-drive', authenticateStudent, deRegisterDrive);

module.exports = router;
