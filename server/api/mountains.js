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

router.post('/updateForecast/:id', (req, res, next) => {
    const mountains = db.get().collection('allMountains');
    mountains.findOne({
        id: +req.params.id
    })
    .then(data => {
        console.log('data:', data);
        res.send(data);
    })
    .catch(err => console.log('err:', err));
})


module.exports = router;
