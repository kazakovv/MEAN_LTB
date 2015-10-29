
app.factory('apiServerRequests', function ($http) {
    var factory = {};
     //kids requests

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


    //update current user
    factory.updateUser = function(user){
        return $http.put('api/Users/updateUser/' + user._id, user);
    };
    /*
     factory.uploadPost = function(post_to_add){
     return $http.post('api/posts',post_to_add);
     };
    */
     return factory;

});