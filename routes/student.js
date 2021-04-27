const express = require('express');
const { editProfile, login } = require('../controllers/student');
const { changePassword, logout } = require('../controllers/user');
const authenticateStudent = require('../middlewares/authentication')('student');

const router = express.Router();

router.get('/', () => {});
router.patch('/', authenticateStudent, editProfile);
router.post('/login', login);
router.get('/drive-details', () => {});
router.post('/register-drive', () => {});
router.post('/change-password', authenticateStudent, changePassword);
router.post('/logout', authenticateStudent, logout);

module.exports = router;
