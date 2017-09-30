'use strict';
const express = require('express');
const router = express.Router();
const db = require('../../database/db');

const  ObjectID = require('mongodb').ObjectID;

router.get('/', (req, res, next) => {
    const mountains = db.get().collection('allMountains');

    mountains.find().toArray()
        .then(data => {
            res.send(data.filter(mtn => {
                return mtn.latitude !== null && mtn.longitude !== null;
            }));
        })
        .catch(err => console.log(err));
});


module.exports = router;
