var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var GrowthRecords = mongoose.model('GrowthRecords');


/* growth records. */
router.route('/growthRecords')
    //upload a growth record
    .post(function(req, res, next) {
        var growthRecord = new GrowthRecords();
        growthRecord.dateGrowth = req.body.dateGrowth;
        growthRecord.head_cfr = req.body.head_cfr;
        growthRecord.height = req.body.height;
        growthRecord.weight = req.body.weight;
        growthRecord.baby_id = req.body.baby_id;

        growthRecord.save(function(err,baby){
            if(err){
                return res.send(500,err);
            }
            return res.json(baby);
        });

    });//end of post

//get growth records for a baby. ID is the id of the baby object
router.route('/babyGrowthRecords/:id')
    .get(function(req, res, next){
        GrowthRecords.find({baby_id: req.params.id}, function(err,babyGrowth){
            if(err){
                return res.send(err);
            }
            return res.json(babyGrowth);
        });//end of find
    }); //end of get

//specific growth record where id is the ID of the growth record
router.route('/growthRecords/:id')
    .get(function(req, res, next) {
        //get existing baby object
        GrowthRecords.findById(req.params.id, function(err,growthRecord){
            if(err){
                return res.send(err);
            }
            return res.json(growthRecord);
        });//end of find
    })//end of get
    .put(function(req, res, next) {
        //update an existing baby object
        GrowthRecords.findById(req.params.id, function(err, growthRecord){
            if(err){
                return res.send(err);
            }

            growthRecord.dateGrowth = req.body.dateGrowth;
            growthRecord.head_cfr = req.body.head_cfr;
            growthRecord.height = req.body.height;
            growthRecord.weight = req.body.weight;
            growthRecord.baby_id = req.body.baby_id;
            growthRecord.save(function(err, growth){
                if(err){
                    return res.send(err);
                }
                return res.json(growth);
            }); //end of save post
        }); //end of find by id
    })//end of put
    .delete(function(req, res, next) {
        //delete a baby object
        GrowthRecords.remove({
            _id: req.params.id
        }, function(err) {
            if(err){
                return res.send(err);
            }
            return res.json("deleted!");
        });
    });

module.exports = router;
