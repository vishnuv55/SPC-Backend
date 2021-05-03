const express = require('express');
const authenticateExecom = require('../middlewares/authentication')('execom');
const { login, getDrives } = require('../controllers/execom');
const { changePassword, logout } = require('../controllers/user');
const { postBillDetails, getBillDetails, deleteBill } = require('../controllers/bill');
const { sendMail } = require('../controllers/mail');

const router = express.Router();

router.get('/', () => {});
router.post('/login', login);
router.get('/drive-details', authenticateExecom, getDrives);
router.get('/bill-details', authenticateExecom, getBillDetails);
router.post('/bill-details', authenticateExecom, postBillDetails);
router.post('send-email', authenticateExecom, sendMail);
router.post('/change-password', authenticateExecom, changePassword);
router.delete('/bill/:id', authenticateExecom, deleteBill);
router.post('/logout', authenticateExecom, logout);

module.exports = router;
