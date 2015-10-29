/**
 * Created by Victor on 10/28/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('Users');




router.route('/updateUser/:id')
    .put(function(req, res) {
        Users.findById(req.params.id, function (err, user) {
            //update the kids array
            user.kids = req.body.kids;

            user.save(function (err, user) {
                if (err) {
                    return res.send({message: 'Error updating user' + err});
                }
                return res.json(user);
            });
        });
    });

module.exports = router;
