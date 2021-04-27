const express = require('express');

const router = express.Router();

const { login } = require('../controllers/execom');
const { postBillDetails, getBillDetails } = require('../controllers/bill');
const authentication = require('../middlewares/authentication')('execom');

router.get('/', () => {});
router.post('/login', login);
router.get('/drive-details', () => {});
router.get('/bill-details', authentication, getBillDetails);
router.post('/bill-details', authentication, postBillDetails);
router.post('send-email', () => {});
router.post('/update-password', () => {});
router.post('/logout', () => {});

module.exports = router;
