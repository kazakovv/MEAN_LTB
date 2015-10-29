/**
 * Created by Victor on 10/3/2015.
 */

app.controller('DevelopmentRecordController',['$scope', '$state', '$filter','passBaby', 'backendlessClasses',
    function($scope,$state,$filter,passBaby, backendlessClasses){

        $scope.baby = passBaby.getBabyObject();

        $scope.init = function(){
          if(typeof $scope.baby == 'undefined'){
              $state.go('login');
          }  else {
              //Load milestones if they exists
              if(!! $scope.baby.milestones){
                  $scope.milestones = $scope.baby.milestones;
                  //reformat dates
                  /*
                  for(i=0; i < $scope.milestones.length; i++){
                      //if the date is not empty reformat it
                      if(!! $scope.milestones[i].date){
                      $scope.milestones[i].date = new Date( $scope.milestones[i].date );
                      }
                  }
                  */
              } else {
                  //if no milestones were saved use the empty array
                  $scope.milestones = [];

              }
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

        $scope.saveMilestones = function(){


            //****** upload in backendless *****

            //get baby table from backendlessClasses service
            var Baby = backendlessClasses.babyTable();
            $scope.baby.milestones = $scope.milestones;
            $scope.baby = angular.copy($scope.baby); //remove $$hashkey added by angular
            var saved = Backendless.Persistence.of( Baby ).save( $scope.baby, new Backendless.Async( savedBaby, gotError ));
            function gotError( err ) // see more on error handling
            {
                console.log( "error message - " + err.message );
                console.log( "error code - " + err.statusCode );
            }
            function savedBaby(baby) {
                alert("The milestones were saved");
            }
            // *** end of upload in backendless ***

        };

        $scope.addMilestone = function () {
            var milestone =  backendlessClasses.developmentRecords();
            $scope.milestoneObject  = new milestone;


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