const express = require('express');
const { isUserLoggedIn } = require('../controllers/common');

const adminRoute = require('./admin');
const execomRoute = require('./execom');
const studentRoute = require('./student');

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/execom', execomRoute);
router.use('/student', studentRoute);
router.get('/is-user-logged-in', isUserLoggedIn);

module.exports = router;
