/**
 * Created by Victor on 9/12/2015.
 */
app.controller('DataController',['$scope', '$state', 'passBaby',function($scope, $state, passBaby){

    $scope.init = function () {

        //find kids of current user
        var currentUser;

        if(Backendless.UserService.getCurrentUser() != null){
            currentUser = Backendless.UserService.getCurrentUser();
            $scope.kids = currentUser.kids;

        } else {
            //redirect to login screen
            $state.go('login');
        }


    };

    $scope.updateBaby = function(baby,pageToForward){

        //pass baby object via service
        passBaby.setBabyObject(baby);
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
