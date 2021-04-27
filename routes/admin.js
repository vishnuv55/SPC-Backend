const express = require('express');

const router = express.Router();
const authenticateAdmin = require('../middlewares/authentication')('admin');
const { login, createStudent, addNewDrive, getDrives } = require('../controllers/admin');

router.post('/login', login);
router.get('/student-details', () => {});
router.post('/create-student', authenticateAdmin, createStudent);
router.get('/drive-details', authenticateAdmin, getDrives);
router.post('/drive-details', authenticateAdmin, addNewDrive);
router.get('/bill-details', () => {});
router.post('/bill-details', () => {});
router.post('/send-email', () => {});
router.get('/alumni-details', () => {});
router.post('/alumni-details', () => {});
router.post('/update-student-password', () => {});
router.post('/update-execom-password', () => {});
router.post('/logout', () => {});

module.exports = router;
