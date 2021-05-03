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
} = require('../controllers/admin');
const { logout } = require('../controllers/user');
const { sendMail } = require('../controllers/mail');

router.post('/login', login);
router.post('/student-details', authenticateAdmin, getRegisteredStudents);
router.post('/create-student', authenticateAdmin, createStudent);
router.get('/drive-details', authenticateAdmin, getDrives);
router.post('/drive-details', authenticateAdmin, addNewDrive);
router.delete('/drive/:id', authenticateAdmin, deleteDrive);
router.get('/bill-details', authenticateAdmin, getBillDetails);
router.post('/bill-details', authenticateAdmin, postBillDetails);
router.post('/send-email', authenticateAdmin, sendMail);
router.get('/alumni-details', () => {});
router.post('/alumni-details', () => {});
router.post('/update-student-password', authenticateAdmin, updateStudentPassword);
router.post('/update-execom-password', authenticateAdmin, updateExecomPassword);
router.delete('/bill/:id', authenticateAdmin, deleteBill);
router.post('/logout', authenticateAdmin, logout);

module.exports = router;
