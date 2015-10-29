/**
 * Created by Victor on 9/8/2015.
 */

app.controller('LogInController', ['$scope', '$state', '$http','$location', 'passObject',
    function($scope, $state, $http, $location, passObject) {


    $scope.login = function() {

        $http.post('/auth/login', $scope.user).success(function(data){
            passObject.setCurrentUser(data.user); //service for passing current user
            $location.path('/main');

        }).error(function(err){
            console.log('error' + err);
        });

    };


}]);