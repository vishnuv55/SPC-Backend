const express = require('express');

const router = express.Router();

router.get('/', () => {});
router.patch('/', () => {});
router.post('/login', () => {});
router.get('/drive-details', () => {});
router.post('/register-drive', () => {});
router.post('/update-password', () => {});
router.post('/logout', () => {});

module.exports = router;
