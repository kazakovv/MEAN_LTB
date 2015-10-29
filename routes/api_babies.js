var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Babies = mongoose.model('Babies');

/* babies */
router.route('/uploadBaby')
    //create a new baby
    .post(function(req, res, next) {
        var baby = new Babies();
        baby.birthdate = req.body.birthdate;
        baby.name = req.body.name;
        baby.boy_girl = req.body.boy_girl;
        baby.parents = req.body.parents;

        baby.save(function(err,post){
            if(err){
                return res.send(500,err);
            }
            return res.json(baby);
        });

    });//end of post

router.route('/babiesParent/:id')
    //get all babies that a parent has
    .get(function(req, res, next){
        Babies.find({ parents: req.params.id },function(err, babies){
            if(err){
                return res.send(err);
            }

            return res.json(babies);
        });//end of find query
    });//end of get


router.route('/babies/:id')
    .get(function(req, res, next) {
        //get existing baby object
        Babies.findById(req.params.id, function(err,baby){
            if(err){
                return res.send(err);
            }
            return res.json(baby);
        });//end of find
    })//end of get
    .put(function(req, res, next) {
        //update an existing baby object
        Babies.findById(req.params.id, function(err, baby){
            if(err){
                return res.send(err);
            }

            baby.birthdate = req.body.birthdate;
            baby.name = req.body.name;
            baby.boy_girl = req.body.boy_girl;
            //todo change parents if need be
            //baby.parents = req.body.parents;

            baby.save(function(err, baby){
                if(err){
                    return res.send(err);
                }
                return res.json(baby);
            }); //end of save post
        }); //end of find by id
    })//end of put
    .delete(function(req, res, next) {
        //delete a baby object
        Babies.remove({
            _id: req.params.id
        }, function(err) {
            if(err){
                return res.send(err);
            }
            return res.json("deleted!");
        });
    });

module.exports = router;
