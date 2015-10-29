var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DevelopmentRecords = mongoose.model('DevelopmentRecords');


/* development records. */
router.route('/developmentRecords')
    //upload a development record
    .post(function(req, res, next) {
        var developmentRecord = new DevelopmentRecords();
        developmentRecord.dateMilestone = req.body.dateMilestone;
        developmentRecord.milestone = req.body.milestone;
        developmentRecord.note = req.body.note;
        developmentRecord.baby_id = req.body.baby_id;


        developmentRecord.save(function(err, developmentRecord){
            if(err){
                return res.send(500,err);
            }
            return res.json(developmentRecord);
        });

    });//end of post

//get development records for a baby. ID is the id of the baby object
router.route('/babyDevelopmentRecords/:id')
    .get(function(req, res, next){
        DevelopmentRecords.find({baby_id: req.params.id}, function(err,developmentRecords){
            if(err){
                return res.send(err);
            }
            return res.json(developmentRecords);
        });//end of find
    }); //end of get

//specific fever record where id is the ID of the fever record
router.route('/developmentRecords/:id')
    .get(function(req, res, next) {
        //get existing fever object
        DevelopmentRecords.findById(req.params.id, function(err, developmentRecord){
            if(err){
                return res.send(err);
            }
            return res.json(developmentRecord);
        });//end of find
    })//end of get
    .put(function(req, res, next) {
        //update an existing fever object
        DevelopmentRecords.findById(req.params.id, function(err, developmentRecord){
            if(err){
                return res.send(err);
            }
            developmentRecord.dateMilestone = req.body.dateMilestone;
            developmentRecord.milestone = req.body.milestone;
            developmentRecord.note = req.body.note;
            developmentRecord.baby_id = req.body.baby_id;
            developmentRecord.save(function(err, development){
                if(err){
                    return res.send(err);
                }
                return res.json(development);
            }); //end of save post
        }); //end of find by id
    })//end of put
    .delete(function(req, res, next) {
        //delete a baby object
        DevelopmentRecords.remove({
            _id: req.params.id
        }, function(err) {
            if(err){
                return res.send(err);
            }
            return res.json("deleted!");
        });
    });

module.exports = router;

