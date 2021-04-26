const express = require('express');

const router = express.Router();

const { login } = require('../controllers/execom');

router.get('/', () => {});
router.post('/login', login);
router.get('/drive-details', () => {});
router.get('/bill-details', () => {});
router.post('/bill-details', () => {});
router.post('send-email', () => {});
router.post('/update-password', () => {});
router.post('/logout', () => {});

module.exports = router;
