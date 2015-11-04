
app.controller('CreateKidsController', ['$scope', '$state', '$filter', '$window', 'passObject', 'apiServerRequests',
    function($scope, $state, $filter, $window, passObject, apiServerRequests) {

        //find kids of current user

        $scope.currentUser;

        var init = function () {

            $scope.currentUser = passObject.getCurrentUser();

            if(passObject.getCurrentUser() != null){
                $scope.currentUser = passObject.getCurrentUser();
                //query kids of current user
                apiServerRequests.getKidsForParent($scope.currentUser._id)
                    .success(function(data){
                    if(data) {
                        $scope.kids = data;
                        //reformat the dates
                        for(i=0; i< $scope.kids.length; i++){
                            $scope.kids[i].birthdate = new Date($scope.kids[i].birthdate);
                        }
                    } else {
                        $scope.kids = [];
                    }
                })
                    .error(function(eror){
                        console.log('Error loading kids ' +eror);
                    });

            } else {
                //redirect to login screen
                $state.go('login');
            }


        };

        init(); //load default values

        $scope.sexBaby = [
            {value: 1, text: 'Boy'},
            {value: 2, text: 'Girl'}
        ];

        $scope.showSex = function(kid) {
            var selected = [];
            if(kid.boy_girl) {
                selected = $filter('filter')($scope.sexBaby, {value: kid.boy_girl});
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        // remove user
        $scope.removeKid = function(index) {

            var deleteKid = $window.confirm('Are you sure you want to delete ' + $scope.kids[index].name + '?');

            if(deleteKid){
                //remove locally
                var babyObjectToRemove = $scope.kids[index];
                $scope.kids.splice(index, 1);
                $scope.currentUser.kids.splice(index,1);//remove from babyId from current user

                //remove from database
                apiServerRequests.removeKid(babyObjectToRemove._id)
                    .success(function(data){
                        alert(babyObjectToRemove.name + " was removed successfully");

                        //update current user on server
                        apiServerRequests.updateUser($scope.currentUser)
                            .success(function(data){
                                alert('Baby reference deleted form current user');
                            })
                            .error(function(err){
                                console.log('error deleting baby reference '+err);
                            });//end of error update current user in database
                    })//end of sucessfully remove baby from database


                    .error(function(err){
                        console.log('error deleting baby '+err);
                    });//end of error remove baby from database

            } //end of check to confirm deletion of kid

        };

        // add a kid
        $scope.addBaby = function() {

            //create a new baby object
            $scope.babyObject = {
                name: "",
                birthdate: "",
                boy_girl: $scope.sexBaby,
                parents: $scope.currentUser._id
            };

            if($scope.kids != null){
                $scope.kids.push($scope.babyObject);
            } else {
                $scope.kids = $scope.babyObject;
            }
        };

        $scope.checkDate = function(data){
          if(data == ''){
              return "Please enter the birthday of your baby";
          }
        };

        $scope.checkName = function(data){
            var nameWithoutSpaces;
            if(data) {

                nameWithoutSpaces = data.toString().replace(" ","");
            }
          if(! nameWithoutSpaces || nameWithoutSpaces == ''){
              return "Please enter a name for your baby";
          }
        };

        $scope.saveKid = function(index){
            //var index = $scope.kids.length -1;
            var babyObject = $scope.kids[index];
            babyObject = angular.copy(babyObject);
            if(! babyObject._id){
                //if the baby object has no id this means that the this is a new baby that has not been uploaded to the server
                apiServerRequests.uploadBaby(babyObject)
                    .success(function(data){
                        $scope.kids[index] = data; //change the kids array locally
                        $scope.kids[index].birthdate = new Date($scope.kids[index].birthdate); //reformat the date
                        alert(data.name + " was successfully added to user " + $scope.currentUser.username);
                        //TODO !!!update the current user with the reference to the baby
                        //$scope.currentUser.kids =  $scope.currentUser.kids.push(data._id);
                        var babyId = $scope.kids[index]._id;
                        //add babyID to kids array
                        $scope.currentUser.kids.push(babyId);

                        apiServerRequests.updateUser($scope.currentUser)
                            .success(function(data){

                            })
                            .error(function(err){
                                console.log('error updating current user '+err);
                            })//end of update current user TODO!!!!

                    }) //end of success upload baby
                    .error(function(err){
                        console.log('Error uploading baby object '+err);
                    });
            } else {
                //if the baby object has an id this means that this is an existing object that only needs to be updated
                    apiServerRequests.updateBaby(babyObject)
                        .success(function(data){
                            alert(data.name + " was successfully updated");
                        })
                        .error(function(err){
                            console.log('Error updating baby object '+err);
                        });
            }
        }; //end of save kid function
    }]);