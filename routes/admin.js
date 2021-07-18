/**
 *
 *
 *
 * Admin routes
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
  addNewDrive,
  getStudents,
  deleteDrive,
  createAlumni,
  deleteStudent,
  createStudent,
  createStudents,
  getAlumniDetails,
  getPlacedStudents,
  updateExecomPassword,
  updateStudentPassword,
  getRegisteredStudents,
  getPlacementYearWiseReport,
} = require('../controllers/admin');
const { logout } = require('../controllers/user');
const { sendMail } = require('../controllers/mail');
const authenticateAdmin = require('../middlewares/authentication')('admin');
const { getQueries, postAnswer, deleteQuery } = require('../controllers/forum');
const { postBillDetails, getBillDetails, deleteBill } = require('../controllers/bill');

const router = express.Router();

router.get('/drive-details', authenticateAdmin, getDrives);
router.get('/forum/queries', authenticateAdmin, getQueries);
router.get('/bill-details', authenticateAdmin, getBillDetails);
router.get('/alumni-details', authenticateAdmin, getAlumniDetails);
router.get('/placement-report', authenticateAdmin, getPlacementYearWiseReport);

router.post('/login', login);
router.post('/logout', authenticateAdmin, logout);
router.post('/send-email', authenticateAdmin, sendMail);
router.post('/students', authenticateAdmin, getStudents);
router.post('/forum/answer', authenticateAdmin, postAnswer);
router.post('/drive-details', authenticateAdmin, addNewDrive);
router.post('/alumni-details', authenticateAdmin, createAlumni);
router.post('/bill-details', authenticateAdmin, postBillDetails);
router.post('/create-student', authenticateAdmin, createStudent);
router.post('/create-students', authenticateAdmin, createStudents);
router.post('/placed-students', authenticateAdmin, getPlacedStudents);
router.post('/student-details', authenticateAdmin, getRegisteredStudents);
router.post('/update-execom-password', authenticateAdmin, updateExecomPassword);
router.post('/update-student-password', authenticateAdmin, updateStudentPassword);

router.delete('/bill/:id', authenticateAdmin, deleteBill);
router.delete('/drive/:id', authenticateAdmin, deleteDrive);
router.delete('/student/:id', authenticateAdmin, deleteStudent);
router.delete('/forum/queries/:id', authenticateAdmin, deleteQuery);

module.exports = router;
