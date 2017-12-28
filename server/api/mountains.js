'use strict';
const express = require('express');
const rp = require('request-promise-any');
const router = express.Router();
const db = require('../../database/db');
const app = require('APP');
const chalk = require('chalk');
const {env} = app;
const darkSkyApiKey = env["DARK_SKY_API_KEY"];

const calcSnowScore = (forecast) => {
    return (forecast.daily.data.reduce((acc, day) => {
      const precip = day.precipType === 'snow' && day.precipAccumulation ? day.precipAccumulation : 0;
      const precipChance = day.precipProbability;
      return acc + precip * precipChance;
    }, 0)).toFixed(2);
  };

//get all mountains with non null lat/long
router.get('/', (req, res, next) => {
  const mountains = db.get().collection('allMountains');

  mountains.find().toArray()
    .then(data => {
        const newArr = [];
        data.forEach((mtn) => {
            if (mtn.latitude && mtn.longitude && mtn.operating_status === 'Operating'){
                mtn.snowScore = calcSnowScore(mtn.forecast);
                mtn.snowScoreAdj = mtn.snowScore / 50 * 100;
                delete mtn.forecast;
                newArr.push(mtn);
            }
        });
        res.send(newArr.sort((a, b) => b.snowScore - a.snowScore));
      })
    .catch(err => console.log(err));
});

router.get('/noForecasts', (req, res, next) => {
  const mountains = db.get().collection('allMountains');

  mountains.find().toArray()
    .then(data => {
      const newArr = [];
      data.forEach(m => {
        delete m.forecast;
        newArr.push(m);
      });
      res.send(newArr);
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
    [['_id', 'asc']],
    {$set: {updated_at: Date.now()}},
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
            [['_id', 'asc']],
            {$set: {forecast: newData, updated_at: Date.now()}},
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
    console.log('req.body:', req.body);
    let updateCount = 0, failCount = 0;
    try {
      locationArray.forEach((location) => {

        const [lat, long, operatingStatus, updatedAt] = location;
        // console.log('lat:', lat, 'long:', long, 'operating Status:', operatingStatus, 'last updated:', updatedAt);
        const hoursSinceLastUpdate = (Date.now() - updatedAt) / 1000 / 60 / 60;
        if (lat &&
            long &&
            operatingStatus === 'Operating' &&
            hoursSinceLastUpdate > 24
        ){
            updateCount++;
            rp({
            url: `https://api.darksky.net/forecast/${darkSkyApiKey}/${lat},${long}`,
            json: true
            })
            .then(forecast => {
                // console.log('received forecast for:', lat, long);
                try {
                    mountains.findAndModify(
                        {latitude: lat, longitude: long},
                        [['_id', 'asc']],
                        {$set: {forecast: forecast, updated_at: Date.now()}},
                        {new: true, upsert: true},
                        function(err, mtn){
                            if (err) console.log('error updating mtn:', err);
                            // console.log(chalk.cyan('properly updated mtn:', mtn.value.name));
                        }
                    );
                } catch (err) {
                    console.log('bulk update error:', err);
                }
            })
            .catch(err => console.log('bulk update catch error', err));
        } else {
            failCount++;
            console.log(chalk.red('update conditions not met', '\n',
            'Lat:', lat, '\n',
            'Long:', long, '\n',
            'operating Status:', operatingStatus, '\n',
            'hours since last update:', hoursSinceLastUpdate
            ));
        }
      });
      const response = {
          updateCount,
          failCount
      };
      res.json(response);
      console.log('update count', updateCount);
      console.log('failure count', failCount);
    } catch (err) {
        console.log('error in foreach', err);
        res.sendStatus(500);
    }
});

router.post('/updateAllDates', (req, res, next) => {
    const mountains = db.get().collection('allMountains');
    mountains.updateMany(
        {},
        {$set: {updated_at: Date.now()}}
    ).then(result => {
        console.log('successfully updated dates');
        res.sendStatus(204);
    })
    .catch(err => {
        console.log('date update error:', err)
        res.sendStatus(500);
    });
});


module.exports = router;

