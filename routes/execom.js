const express = require('express');
const authenticateExecom = require('../middlewares/authentication')('execom');
const { login, getDrives } = require('../controllers/execom');
const { changePassword, logout } = require('../controllers/user');
const { postBillDetails, getBillDetails } = require('../controllers/bill');

const router = express.Router();

router.get('/', () => {});
router.post('/login', login);
router.get('/drive-details', authenticateExecom, getDrives);
router.get('/bill-details', authenticateExecom, getBillDetails);
router.post('/bill-details', authenticateExecom, postBillDetails);
router.post('send-email', () => {});
router.post('/change-password', authenticateExecom, changePassword);
router.post('/logout', authenticateExecom, logout);

module.exports = router;
