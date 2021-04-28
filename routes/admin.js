const express = require('express');

const router = express.Router();
const authenticateAdmin = require('../middlewares/authentication')('admin');
const { postBillDetails, getBillDetails, deleteBill } = require('../controllers/bill');
const {
  login,
  createStudent,
  addNewDrive,
  getDrives,
  updateStudentPassword,
  updateExecomPassword,
} = require('../controllers/admin');
const { logout } = require('../controllers/user');

router.post('/login', login);
router.get('/student-details', () => {});
router.post('/create-student', authenticateAdmin, createStudent);
router.get('/drive-details', authenticateAdmin, getDrives);
router.post('/drive-details', authenticateAdmin, addNewDrive);
router.get('/bill-details', authenticateAdmin, getBillDetails);
router.post('/bill-details', authenticateAdmin, postBillDetails);
router.post('/send-email', () => {});
router.get('/alumni-details', () => {});
router.post('/alumni-details', () => {});
router.post('/update-student-password', authenticateAdmin, updateStudentPassword);
router.post('/update-execom-password', authenticateAdmin, updateExecomPassword);
router.delete('/bill/:id', authenticateAdmin, deleteBill);
router.post('/logout', authenticateAdmin, logout);

module.exports = router;
