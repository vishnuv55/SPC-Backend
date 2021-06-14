const express = require('express');

const router = express.Router();
const authenticateAdmin = require('../middlewares/authentication')('admin');
const { postBillDetails, getBillDetails, deleteBill } = require('../controllers/bill');
const {
  login,
  createStudent,
  addNewDrive,
  getDrives,
  deleteDrive,
  updateStudentPassword,
  updateExecomPassword,
  getRegisteredStudents,
  createStudents,
  createAlumni,
  getAlumniDetails,
} = require('../controllers/admin');
const { logout } = require('../controllers/user');
const { sendMail } = require('../controllers/mail');
const { getQueries, postAnswer, deleteQuery } = require('../controllers/forum');

router.post('/login', login);
router.post('/student-details', authenticateAdmin, getRegisteredStudents);
router.post('/create-students', authenticateAdmin, createStudents);
router.post('/create-student', authenticateAdmin, createStudent);
router.get('/drive-details', authenticateAdmin, getDrives);
router.post('/drive-details', authenticateAdmin, addNewDrive);
router.delete('/drive/:id', authenticateAdmin, deleteDrive);
router.get('/bill-details', authenticateAdmin, getBillDetails);
router.post('/bill-details', authenticateAdmin, postBillDetails);
router.post('/send-email', authenticateAdmin, sendMail);
router.get('/alumni-details', authenticateAdmin, getAlumniDetails);
router.post('/alumni-details', authenticateAdmin, createAlumni);
router.post('/update-student-password', authenticateAdmin, updateStudentPassword);
router.post('/update-execom-password', authenticateAdmin, updateExecomPassword);
router.delete('/bill/:id', authenticateAdmin, deleteBill);
router.post('/logout', authenticateAdmin, logout);
router.get('/forum/queries', authenticateAdmin, getQueries);
router.post('/forum/answer', authenticateAdmin, postAnswer);
router.delete('/forum/queries/:id', authenticateAdmin, deleteQuery);

module.exports = router;
