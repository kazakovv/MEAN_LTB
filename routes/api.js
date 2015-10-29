var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');


/* middleware for redirecting to login page if the user is not authenticated*/
router.use(function(req,res,next){
  //todo: redirect to login page if not authenicated
    /*
    //user not authenticated redirect to login
   if(!req.isAuthenticated()){
       res.redirect('/#login')
   }
   */
    //user authenticated continue to next middleware or handler
    return next();
});

//render main page

/* GET home page. */
/* route to public/index.html */
router.get('/', function(req, res, next) {
    //console.log("request is " + req.user.username);
    res.render('index', { title: "Chirp"});
});


module.exports = router;
