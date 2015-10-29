/**
 * Created by Victor on 10/4/2015.
 */

app.controller('FeverRecordController',['$scope', '$state','passBaby', 'backendlessClasses',
    function($scope,$state,passBaby, backendlessClasses){

        $scope.baby = passBaby.getBabyObject();

        $scope.init = function(){
            if(typeof $scope.baby == 'undefined'){
                $state.go('login');
            }  else {
                //Load fever record it exists
                if(!! $scope.baby.feverRecord){

                    //$scope.fevers = JSON.parse($scope.baby.feverRecord);
                    $scope.fevers = $scope.baby.feverRecord;
                    //reformat dates
                    for(i=0; i < $scope.fevers.length; i++){
                        //if the date is not empty reformat it
                        if(!! $scope.fevers[i].dateFever){
                            $scope.fevers[i].dateFever = new Date( $scope.fevers[i].dateFever );
                        }
                    }
                } else {
                    //if no fevers were saved use the empty array
                    $scope.fevers = [];
                }
            }
        };
        $scope.removeFever = function(index){
            var itemToRemove = $scope.fevers[index];
            $scope.fevers.splice(index, 1);
            //remove from Backendless
            var feverRecordTable = backendlessClasses.feverRecord();
            var feverRecord = Backendless.Persistence.of(feverRecordTable);
            feverRecord.remove(itemToRemove);

        };
        $scope.addFever = function(){
            var fever =  backendlessClasses.feverRecord();
            $scope.feverObject  = new fever;


            $scope.fevers.push($scope.feverObject);

        };

        $scope.saveFeverRecord = function () {

            //****** upload in backendless *****

            //get baby table from backendlessClasses service
            var Baby = backendlessClasses.babyTable();
            //$scope.baby.feverRecord = JSON.stringify($scope.fevers);

            $scope.fevers = angular.copy($scope.fevers);
            $scope.baby.feverRecord = [];
            $scope.baby.feverRecord = $scope.fevers;
            $scope.baby = angular.copy($scope.baby); //remove $$hashkey added by angular

            var saved = Backendless.Persistence.of( Baby ).save( $scope.baby, new Backendless.Async( savedBaby, gotError ));
            function gotError( err ) // see more on error handling
            {
                console.log( "error message - " + err.message );
                console.log( "error code - " + err.statusCode );
            }
            function savedBaby(baby) {
                alert("The data was saved");
            }
            // *** end of upload in backendless ***

        };

        /* check input methods*/
        $scope.checkDate = function (dateEntered) {

            if(dateEntered == '') {
                return "Please enter a date";
            }

            var birthDate = new Date($scope.baby.birthdate);
            var dateEntered = new Date(dateEntered);
            var difference = dateEntered.getTime() - birthDate.getTime();

            if(difference < 0){
                return "This is before your baby was born";
            }
        };

        $scope.checkTime = function(timeEntered){
            if(timeEntered == ''){
                return "Please enter the time"
            }
        };
        $scope.checkTemp = function(tempEntered){
            if(tempEntered == ''){
                return "Please enter the temperature";
            }
            var temp = parseInt(tempEntered)
            if(temp < 30) {
                return "Entered temp is too low";
            }
            if(temp > 45) {
                return "Entered temp is too high"
            }
        };


    }]);
