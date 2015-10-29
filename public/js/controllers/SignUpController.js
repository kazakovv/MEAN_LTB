/**
 * Created by Victor on 9/8/2015.
 */
app.controller('SignUpController', ['$scope', '$state', '$http', '$location','passObject',
    function($scope,$state, $http, $location, passObject) {



    $scope.signup = function(){

        $http.post('auth/signup',$scope.user).success(function(data){
            passObject.setCurrentUser(data);
            $location.path('/main');
        }).error(function(err){
            console.log('error ' + err);
        });

    };
}]);