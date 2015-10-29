/**
 * Created by Victor on 10/27/2015.
 */
app.controller('MainController', ['$scope', '$state','$location','passObject',
    function($scope, $state, $location, passObject) {

    $scope.currentUser = passObject.getCurrentUser();

        if(! $scope.currentUser) {
            //if the current user is empty redirect to login page
            $location.path('/login');
        }

}]);