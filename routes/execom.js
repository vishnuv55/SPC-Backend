const express = require('express');
const authenticateExecom = require('../middlewares/authentication')('execom');
const { login } = require('../controllers/execom');
const { changePassword, logout } = require('../controllers/user');

const router = express.Router();

router.get('/', () => {});
router.post('/login', login);
router.get('/drive-details', () => {});
router.get('/bill-details', () => {});
router.post('/bill-details', () => {});
router.post('send-email', () => {});
router.post('/change-password', authenticateExecom, changePassword);
router.post('/logout', authenticateExecom, logout);

module.exports = router;
