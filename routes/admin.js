const express = require('express');

const router = express.Router();

const { login } = require('../controllers/admin');

router.post('/login', login);
router.get('/student-details', () => {});
router.post('/create-student', () => {});
router.get('/drive-details', () => {});
router.post('/drive-details', () => {});
router.get('/bill-details', () => {});
router.post('/bill-details', () => {});
router.post('/send-email', () => {});
router.get('/alumni-details', () => {});
router.post('/alumni-details', () => {});
router.post('/update-student-password', () => {});
router.post('/update-execom-password', () => {});
router.post('/logout', () => {});

module.exports = router;
