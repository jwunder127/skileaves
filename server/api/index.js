'use strict'; // eslint-disable-line semi
const express = require('express');
const router = express.Router();

router.use('/mountains', require('./mountains'));

module.exports = router;
