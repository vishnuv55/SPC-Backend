/**
 *
 *
 *
 * Student routes
 *
 * @author Anandhakrishnan M
 * @github https://github.com/anandhakrishnanm
 *
 * @author Vishnu viswambharan
 * @github https://github.com/vishnuv55
 *
 */
const express = require('express');
const {
  login,
  getDrives,
  editProfile,
  registerDrive,
  deRegisterDrive,
  getStudentDetails,
  updatePlacementStatus,
} = require('../controllers/student');
const { changePassword, logout } = require('../controllers/user');
const { postQuery, getQueries, editQuestion } = require('../controllers/forum');
const authenticateStudent = require('../middlewares/authentication')('student');

const router = express.Router();

router.get('/', authenticateStudent, getStudentDetails);
router.get('/drive-details', authenticateStudent, getDrives);
router.get('/forum/queries', authenticateStudent, getQueries);

router.post('/login', login);
router.post('/logout', authenticateStudent, logout);
router.post('/forum/question', authenticateStudent, postQuery);
router.post('/register-drive', authenticateStudent, registerDrive);
router.post('/change-password', authenticateStudent, changePassword);
router.post('/deregister-drive', authenticateStudent, deRegisterDrive);
router.post('/placement-details', authenticateStudent, updatePlacementStatus);

router.patch('/', authenticateStudent, editProfile);
router.patch('/forum/question', authenticateStudent, editQuestion);

module.exports = router;
