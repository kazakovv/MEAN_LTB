/**
 * Created by Victor on 9/12/2015.
 */
app.factory('passObject', function() {

    var babyObject;
    var currentUser;

    return {
        getBabyObject: function () {
            return babyObject;
        },
        setBabyObject: function (value) {
            babyObject = value;
        },
        getCurrentUser: function () {
            return currentUser;
        },
        setCurrentUser: function (value) {
            currentUser = value;
        }
    };


});