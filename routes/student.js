const express = require('express');
const { editProfile, login } = require('../controllers/student');
const authentication = require('../middlewares/authentication')('student');

const router = express.Router();

router.get('/', () => {});
router.patch('/', authentication, editProfile);
router.post('/login', login);
router.get('/drive-details', () => {});
router.post('/register-drive', () => {});
router.post('/update-password', () => {});
router.post('/logout', () => {});

module.exports = router;
