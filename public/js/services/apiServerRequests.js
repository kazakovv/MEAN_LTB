
app.factory('apiServerRequests', function ($http) {
    var factory = {};

     /* KIDS REQUESTS*/

     factory.getKidsForParent = function(id){
         //the id is of the parent object. Returns all kids that a parent has
        return $http.get('/api/Babies/babiesParent/' + id);
     };

    factory.removeKid = function(id){
      return $http.delete('/api/Babies/babies/' + id);
    };

    factory.uploadBaby = function(baby){
      return $http.post('api/Babies/uploadBaby', baby);
    };
    factory.updateBaby = function(baby){
        return $http.put('api/Babies/babies/' + baby._id, baby);
    };

    /* CURRENT USER */
    //update current user
    factory.updateUser = function(user){
        return $http.put('api/Users/updateUser/' + user._id, user);
    };

    /* GROWTH RECORDS API */

    factory.getGrowthRecordsForBaby = function(id){
        return $http.get('api/GrowthRecords/babyGrowthRecords/' + id);
    };

    factory.deleteGrowthRecord = function(id){
        return $http.delete('api/GrowthRecords/growthRecords/' + id);
    };
    //get specific growth record
    factory.getGrowthRecord = function(id){
        return $http.get('api/GrowthRecords/growthRecords/' + id);
    };
    //create growth record
    factory.createGrowthRecord = function(growthRecord) {
        return $http.post('api/GrowthRecords/growthRecords', growthRecord)
    };

    factory.updateGrowthRecord = function(growthRecord) {
        return $http.put('api/GrowthRecords/growthRecords/ ' + growthRecord._id, growthRecord);
    };

     return factory;

});