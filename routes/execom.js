const express = require('express');

const router = express.Router();

router.get('/', () => {});
router.post('/login', () => {});
router.get('/drive-details', () => {});
router.get('/bill-details', () => {});
router.post('/bill-details', () => {});
router.post('send-email', () => {});
router.post('/update-password', () => {});
router.post('/logout', () => {});

module.exports = router;
