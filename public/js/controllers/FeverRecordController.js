/**
 * Created by Victor on 10/4/2015.
 */

app.controller('FeverRecordController',['$scope', '$state','passObject', 'apiServerRequests',
    function($scope,$state, passObject, apiServerRequests){


        $scope.baby = passObject.getBabyObject();

        var reformatDates = function () {
            //reformat dates
            for(i=0; i < $scope.fevers.length; i++){
                //if the date is not empty reformat it
                if(!! $scope.fevers[i].dateFever){
                    $scope.fevers[i].dateFever = new Date( $scope.fevers[i].dateFever );
                }
            } //end of reformat the dates

        };
        $scope.init = function(){
            if(typeof $scope.baby == 'undefined'){
                $state.go('login');
            }  else {
                //Load fever records they exists
                apiServerRequests.loadFeverRecords($scope.baby._id)
                    .success(function(feverRecords){
                       $scope.fevers = feverRecords;
                       reformatDates();
                    })
                    .error(function(err){
                       console.log('Error getting the fever records ' +err);
                    });

            }
        };
        $scope.removeFever = function(index){
            var itemToRemove = $scope.fevers[index];
            apiServerRequests.deleteFeverRecord(itemToRemove)
                .success(function(data){
                    //remove the record locally as well
                    $scope.fevers.splice(index, 1);
                })
                .error(function(err){
                   console.log('Error deleting fever recrod from the database '+err);
                });

        };
        $scope.addFever = function(){

            $scope.feverObject  = {
                temp:'',
                medication:'',
                dose:'',
                timeFever:'',
                dateFever:'',
                baby_id: $scope.baby._id
            };


            $scope.fevers.push($scope.feverObject);

        };

        $scope.saveFeverRecord = function (index) {

            var feverRecordToSave  = $scope.fevers[index];

            //check if fever object has id.
            // If it has id this means that it has already been saved in the DB and we need to update it only
            if( ! feverRecordToSave._id){
                //if the fever object has no id this means that the this is a new object
                // that has not been uploaded to the server

                //upload to the server

                apiServerRequests.uploadFeverRecord(feverRecordToSave)
                    .success(function(data){
                        //update the growth records array locally

                        //reformat the date
                        data.dateFever = new Date(data.dateFever);
                        data.timeFever = new Date(data.timeFever);

                        $scope.fevers[index] = data;
                        alert('Successfully saved');
                    })
                    .error(function(err){
                        console.log('Error uploading milestone ' +err);

                    });
                //end of check if this is a new growth record object that has not been uploaded to the server
            } else{
                //if growth record object has an id this is an existing entry and we only update the existing object in the database
                apiServerRequests.updateFeverRecord(feverRecordToSave)
                    .success(function(data){
                        //reformat the date
                        //reformat the date
                        data.dateFever = new Date(data.dateFever);
                        data.timeFever = new Date(data.timeFever);
                        $scope.fevers[index] = data;
                        alert('Successfully updated');
                    })
                    .error(function(err){
                        console.log('Error updating milestone record ' +err);
                    })
            }

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
