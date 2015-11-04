/**
 * Created by Victor on 9/12/2015.
 */
app.controller('DataController',['$scope', '$state', 'passObject','apiServerRequests',
    function($scope, $state, passObject, apiServerRequests){

    $scope.init = function () {

        //find kids of current user
        var currentUser;

        if(passObject.getCurrentUser() != null){
            currentUser = passObject.getCurrentUser();

            //get the kids of the current user
            apiServerRequests.getKidsForParent(currentUser._id)
                .success(function(data){
                    $scope.kids = data;
                })
                .error(function(err){
                    console.log('Error downloading kids for user '+err);
                });
        } else {
            //redirect to login screen
            $state.go('login');
        }
    };

    $scope.updateBaby = function(baby,pageToForward){

        //pass baby object via service
        passObject.setBabyObject(baby);
        switch (pageToForward){
            case 'GrowthRecord':
                $state.go('growthrecord');
                break;
            case 'DevelopmentRecord':
                $state.go('developmentrecord');
                break;
            case 'FeverRecord':
                $state.go('feverrecord');
                break;
        }

    }

}]);
