var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //tell passport which id to use for user
        console.log('serializing user:',user._id);
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        //return the user object back
        Users.findById(id, function(err, user){
            if(err){
                return done({message:'there is an error ' +err },false);
            }

            if(! user) {
                return done({message: 'user not found'}, false);
            }
            //we found the user provided back to passport
            return done(null, user);
        });

    });

    passport.use('login', new LocalStrategy({
            usernameField:'email',
            passReqToCallback : true
        },
        function(req, email, password, done) {

            Users.findOne({email: email}, function(err, user){
                console.log('password ' + password + ' email ' + email);

                if(err){
                    //db error
                    console.log('db error ' +err );
                    return done({errCode: 111, message: 'Database error '},false);
                }
                if(! user){
                    //no user found with this email
                    console.log('no user found');
                    return done({
                        errCode: 222, message:'Incorrect email'}, false);
                }

                if(! isValidPassword(user,password)){
                    //invalid password
                    console.log('invalid password');
                    return done( {errCode: 333, message: 'Invalid password'}, false);
                }
                //login if no errors are found
                return done(null, user);

            });

        }
    ));

    passport.use('signup', new LocalStrategy({
                usernameField:'email',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                Users.findOne({email: email}, function(err, user){
                    if(err){
                        //db error
                        console.log('DB error '+err);
                        return done( {errCode: 444, message:err},false)
                    }
                    if(user){
                        //user already exists
                        console.log('Email taken');
                        return done({errCode: 555, message:'Email taken'}, false);
                    }

                    var user = new Users();
                    user.email = email;
                    user.username = req.body.username;
                    user.password = createHash(password);
                    user.save(function(err, user){
                        if(err){
                            //db error
                            console.log('db error ' +err);
                            return done({errCode: 111, message: 'Database error'}, false);
                        }
                        console.log('successfully signup up user');
                        return done(null, user);
                    });
                }); //end of find one query




            })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};