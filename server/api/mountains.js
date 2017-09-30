'use strict';
const express = require('express');
const router = express.Router();
const db = require('../../database/db');

const  ObjectID = require('mongodb').ObjectID;

router.get('/', (req, res, next) => {
    const mountains = db.get().collection('allMountains');

    mountains.find().toArray()
        .then(data => {
            res.send(data);
        })
        .catch(err => console.log(err));
});


module.exports = router;
