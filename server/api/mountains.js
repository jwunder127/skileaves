'use strict';
const express = require('express');
const rp = require('request-promise-any');
const router = express.Router();
const db = require('../../database/db');
const  ObjectID = require('mongodb').ObjectID;
const app = require('APP');
const {env} = app;
const darkSkyApiKey = env["DARK_SKY_API_KEY"];


//get all mountains with non null lat/long
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

//get a single mountain by its id
router.get('/:id', (req, res, next) => {
  const mountains = db.get().collection('allMountains');
  mountains.findOne({
      id: +req.params.id
  })
  .then(mtn => {
      res.send(mtn);
  })
  .catch(err => console.log('finding mtn error', err));
});


//testing out mongodb update features
router.post('/testUpdate/:lat/:long', (req, res, next) => {
  const mountains = db.get().collection('allMountains');
  mountains.findAndModify(
    {latitude: +req.params.lat, longitude: +req.params.long},
    [['_id','asc']],
    {$set: {updated_at: Date().toString()}},
    {new: true, upsert: true}
  )
  .then(mtn => res.send(mtn))
  .catch(err => console.log('there was an err:', err));
});

//update single forecast
router.post('/updateForecast/:lat/:long', (req, res, next) => {
  const mountains = db.get().collection('allMountains');
    rp({
      url: `https://api.darksky.net/forecast/${darkSkyApiKey}/${req.params.lat},${req.params.long}`,
      json: true
      })
      .then(newData => {
         try {
           mountains.findAndModify(
            {latitude: +req.params.lat, longitude: +req.params.long},
            [['_id','asc']],
            {$set:{forecast: newData, updated_at: Date().toString()}},
            {new: true, upsert: true}
          );
            res.sendStatus(204);
            } catch (err) {
              console.log('mongo error:', err);
            }
      })
      .catch(err => console.log('forecast error:', err));
});

//update all forecasts
//send array of lat/long arrays as req.body.mtnArray
//for each one, make an api call
//then, find each in the db by lat/long and update it.
router.post('/updateAllForecasts', (req, res, next) => {
    const mountains = db.get().collection('allMountains');
    const locationArray = req.body.mtnArray;
    // console.log('req.body:', req.body);
    try {
      locationArray.forEach((location) => {

        const [lat, long] = location;
        // console.log('lat:', lat, 'long:', long);
        if (lat && long){
            rp({
            url: `https://api.darksky.net/forecast/${darkSkyApiKey}/${lat},${long}`,
            json: true
            })
            .then(forecast => {
                console.log('received forecast for:', lat, long);
                try {
                    mountains.findAndModify(
                        {latitude: lat, longitude: long},
                        [['_id','asc']],
                        {$set:{forecast: forecast, updated_at: Date().toString()}},
                        {new: true, upsert: true},
                        function(err, mtn){
                            if (err) console.log('error updating mtn:', err);
                            console.log('properly updated mtn:', mtn.value.name);
                        }
                    );
                } catch (err) {
                    console.log('bulk update error:', err);
                }
            })
            .catch(err => console.log('bulk update catch error', err));
        }
      });
      res.sendStatus(204);
    } catch (err) {
        console.log('error in foreach', err);
        res.sendStatus(500);
    }
});


module.exports = router;

