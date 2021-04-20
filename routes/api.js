const express = require('express');

const adminRoute = require('./admin');
const execomRoute = require('./execom');
const studentRoute = require('./student');

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/execom', execomRoute);
router.use('/student', studentRoute);
router.get('/is-user-logged-in', () => {});

module.exports = router;
