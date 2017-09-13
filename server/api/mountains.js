'use strict';

const  ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
    app.post('/mountains', (req, res) => {
        const note = { text: req.body.body, title: req.body.title };
        db.collection('allMountains').insert(note, (err, result) => {
        if (err) {
            res.send({ error: 'An error has occurred' });
        } else {
            res.send(result.ops[0]);
        }
        });
    });
    app.get('/mountains', (req, res) => {
        const details = { name: 'Marble Mountain' };
        db.collection('allMountains').find().toArray()
            .then(data => {
                res.send(data);
            })
            .catch(err => console.log(err));
    });
};
