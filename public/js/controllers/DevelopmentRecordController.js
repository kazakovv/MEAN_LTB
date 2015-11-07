/**
 * Created by Victor on 10/3/2015.
 */

app.controller('DevelopmentRecordController',['$scope', '$state', '$filter','passObject', 'apiServerRequests',
    function($scope,$state,$filter,passObject, apiServerRequests){
        //helper function for reformatting the dates of the milestones
        var reformatDatesOfMilestones = function(){
            for(i=0; i < $scope.milestones.length; i++){
                //if the date is not empty reformat it
                if(!! $scope.milestones[i].dateMilestone){
                    $scope.milestones[i].dateMilestone = new Date( $scope.milestones[i].dateMilestone );

                }//end of if statement
            }//end of reformat dates for loop
        };//end of helper function for reformatting the dates of the milestones

        $scope.baby = passObject.getBabyObject();

        $scope.init = function(){
          if(typeof $scope.baby == 'undefined'){
              $state.go('login');
          }  else {
              //Load milestones if they exists
              apiServerRequests.loadMilestones($scope.baby._id)
                  .success(function(data){
                      $scope.milestones = data;
                      reformatDatesOfMilestones();

                  })
                  .error(function (err) {
                      console.log('Error loading milestones '+err);
                  });

          }
        };

        $scope.checkDate = function (dateEntered) {
            var birthDate = new Date($scope.baby.birthdate);
            var dateUserEntered = new Date(dateEntered);
            var difference = dateUserEntered.getTime() - birthDate.getTime();
            if(difference < 0){
                return "This is before your baby was born";
            }
        };



        $scope.calculateAgeMilestoneAchieved = function(dateMilestoneAchieved){
            //reformat the date
            dateMilestoneAchieved = new Date(dateMilestoneAchieved);
            if(!! dateMilestoneAchieved){

                var birthDate = new Date($scope.baby.birthdate);
                var day = 1000 * 3600 * 24;

                var differenceInDays = Math.round( (dateMilestoneAchieved.getTime() - birthDate.getTime())/day );
                //check whether time passed is in years or days
                if(differenceInDays < 360){
                    return differenceInDays + " days";
                } else {
                    return Math.round(differenceInDays/360).toFixed(1) + " years";
                }
            } //end of check if dateMilestoneAchieved is not empty
        };

        $scope.saveMilestone = function(index){


            var milestoneObject = $scope.milestones[index];
            //check if milestone has id.
            // If it has id this means that it has already been saved in the DB and we need to update it only
            if( ! milestoneObject._id){
                //if the milestone  object has no id this means that the this is a new object
                // that has not been uploaded to the server

                //upload to the server

                apiServerRequests.uploadMilestone(milestoneObject)
                    .success(function(data){
                        //update the growth records array locally

                        //reformat the date
                        data.dateMilestone = new Date(data.dateMilestone);
                        $scope.milestones[index] = data;
                        alert('Successfully saved');
                    })
                    .error(function(err){
                        console.log('Error uploading milestone ' +err);

                    });
                //end of check if this is a new growth record object that has not been uploaded to the server
            } else{
                //if growth record object has an id this is an existing entry and we only update the existing object in the database
                apiServerRequests.updateMilestone(milestoneObject)
                    .success(function(data){
                        //reformat the date
                        data.dateMilestone = new Date(data.dateMilestone);
                        $scope.milestones[index] = data;
                        alert('Successfully updated');
                    })
                    .error(function(err){
                        console.log('Error updating milestone record ' +err);
                    })
            }
        };

        $scope.addMilestone = function () {

            $scope.milestoneObject  = {
                notes:'',
                milestone:'',
                dateMilestone: new Date(),
                baby_id: $scope.baby._id
            };


            $scope.milestones.push($scope.milestoneObject);

        };
        $scope.removeMilestone = function(index){
            var itemToRemove = $scope.milestones[index];
            $scope.milestones.splice(index, 1);
            //remove from Backendless
            var milestonesRecordTable = backendlessClasses.developmentRecords();
            var milestoneRecord = Backendless.Persistence.of(milestonesRecordTable);
            milestoneRecord.remove(itemToRemove);

        };
        //method used for dropdown menu in form
        $scope.showMilestone = function(milestone) {
            var selected = [];
            if(milestone.milestone) {
                selected = $filter('filter')($scope.milestoneOptions, {value: milestone.milestone});
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        /* Development milestones*/
        $scope.milestoneOptions = [
            {
                value: 1, text:'Smiles'
            },
            {
                value: 2, text:'Makes a fist'
            },
            {
                value: 3, text:'Grasps onto something'
            },
            {
                value: 4, text:'Uses raking grasp'
            },
            {
                value: 5, text:'Uses pincer grasp'
            },
            {
                value: 6, text:'Transfers an object from one hand to the other'
            },
            {
                value: 7, text:'Lifts head while on stomach'
            },
            {
                value: 8, text:'Eyes follow a moving object'
            },
            {
                value: 9, text:'Imitates movements'
            },
            {
                value: 10, text:'Imitates facial expressions'
            },
            {
                value: 11, text:'recognizes mom and dad'
            },
            {
                value: 12, text:'Responds to name'
            },
            {
                value: 13, text:'Responds to \"no\"'
            },
            {
                value: 14, text:'Recognizes emotions by the tones of your voice'
            },
            {
                value: 15, text:'Imitates sounds'
            },
            {
                value: 16, text:'Uses voice to express own emotions'
            },
            {
                value: 17, text:'Babbles'
            },
            {
                value: 18, text:'Says first word'
            },
            {
                value: 19, text:'Responds to simple requests'
            },
            {
                value: 20, text:'Finds a hidden object'
            },
            {
                value: 21, text:'Connects objects to their names'
            },
            {
                value: 22, text:'Gets first tooth'
            },
            {
                value: 23, text:'Rolls over'
            },
            {
                value: 24, text:'Sits on own'
            },
            {
                value: 25, text:'Crawls'
            },
            {
                value: 26, text:'Pulls up to stand'
            },
            {
                value: 27, text:'Stands on own'
            },
            {
                value: 28, text:'Takes first steps with help'
            },
            {
                value: 29, text:'Walks on own'
            }
        ]


    }]);