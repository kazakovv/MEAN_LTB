var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var FeverRecords = mongoose.model('FeverRecords');


/* growth records. */
router.route('/feverRecords')
    //upload a fever record
    .post(function(req, res, next) {
        var feverRecord = new FeverRecords();
        feverRecord.dateFever = req.body.dateFever;
        feverRecord.timeFever = req.body.timeFever;
        feverRecord.dose = req.body.dose;
        feverRecord.medication = req.body.medication;
        feverRecord.temp = req.body.temp;
        feverRecord.baby_id = req.body.baby_id;

        feverRecord.save(function(err,feverRecord){
            if(err){
                return res.send(500,err);
            }
            return res.json(feverRecord);
        });

    });//end of post

//get fever records for a baby. ID is the id of the baby object
router.route('/babyFeverRecords/:id')
    .get(function(req, res, next){
        FeverRecords.find({baby_id: req.params.id}, function(err,feverRecord){
            if(err){
                return res.send(err);
            }
            return res.json(feverRecord);
        });//end of find
    }); //end of get

//specific fever record where id is the ID of the fever record
router.route('/feverRecords/:id')
    .get(function(req, res, next) {
        //get existing fever object
        FeverRecords.findById(req.params.id, function(err, feverRecord){
            if(err){
                return res.send(err);
            }
            return res.json(feverRecord);
        });//end of find
    })//end of get
    .put(function(req, res, next) {
        //update an existing fever object
        FeverRecords.findById(req.params.id, function(err, feverRecord){
            if(err){
                return res.send(err);
            }

            feverRecord.dateFever = req.body.dateFever;
            feverRecord.timeFever = req.body.timeFever;
            feverRecord.dose = req.body.dose;
            feverRecord.medication = req.body.medication;
            feverRecord.temp = req.body.temp;
            feverRecord.baby_id = req.body.baby_id;

            feverRecord.save(function(err, fever){
                if(err){
                    return res.send(err);
                }
                return res.json(fever);
            }); //end of save post
        }); //end of find by id
    })//end of put
    .delete(function(req, res, next) {
        //delete a baby object
        FeverRecords.remove({
            _id: req.params.id
        }, function(err) {
            if(err){
                return res.send(err);
            }
            return res.json("deleted!");
        });
    });

module.exports = router;

