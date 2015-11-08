/**
 * Created by Victor on 10/1/2015.
 */

app.controller('GrowthRecordController',['$scope', '$state','passObject', 'growthTables', 'apiServerRequests',
    function($scope,$state, passObject, growthTables, apiServerRequests ){

        //get baby object passed from the passBaby service
        var babyObject = passObject.getBabyObject();

        var currentUser;

        $scope.init = function () {


            if(typeof babyObject == "undefined"){
                $state.go('login');
            } else {
                $scope.baby = babyObject;

                    //get growth records for a baby object
                    apiServerRequests.getGrowthRecordsForBaby(babyObject._id)
                        .success(function(data){
                            $scope.growthRecords = data;
                            $scope.growthRecords.sort(sortByDate);

                            //reformat the dates
                            for(i=0; i < $scope.growthRecords.length; i ++){
                                $scope.growthRecords[i].dateGrowth = new Date($scope.growthRecords[i].dateGrowth);
                            }
                    })
                        .error(function(err){
                           console.log('error getting growth records from database '+err);
                    });


            } //end of check if babyObject is undefined

        };

        $scope.calculatePercentile = function(record,percentileToCalculate) {
            //check if this is a new row with no data entered and exit if yes
            if(! record.dateGrowth) {
                return;
            }

            //get the value of the growth record we are calculating the percentile for,. i.e. the height, length, or head cfr
            var valueGrowthRecord;
            switch (percentileToCalculate){
                case "Weight":
                    valueGrowthRecord = record.weight;
                    break;
                case "Height":
                    valueGrowthRecord = record.height;
                    break;
                case "HeadCircumference":
                    valueGrowthRecord = record.head_cfr;
                    break;
            }
            return growthTables.calculatePercentile(record.dateGrowth, $scope.baby.birthdate,valueGrowthRecord,
                percentileToCalculate, $scope.baby.boy_girl );


        };

        $scope.removeValue = function(index){
            var itemToRemove = $scope.growthRecords[index];
            $scope.growthRecords.splice(index, 1);

            //remove from database
            apiServerRequests.deleteGrowthRecord(itemToRemove._id)
                .success(function(data){
                    console.log('successfully deleted growth record');
                })
                .error(function(err){
                   console.log('error deleting growth record' + err);
                });


        };
        $scope.addValue = function(){


            $scope.newValue = {
                dateGrowth: new Date(),
                head_cfr: '',
                height: '',
                weight: '',
                baby_id: babyObject._id
            };
            $scope.growthRecords.push($scope.newValue);
        };

        $scope.sortGrowthArray = function(){
          $scope.growthRecords.sort(sortByDate);
        };

        $scope.saveGrowthRecord = function(index) {
            var growthRecordObject = $scope.growthRecords[index];
            if( ! growthRecordObject._id){
                //if the growth record object has no id this means that the this is a new object
                // that has not been uploaded to the server

                //upload to the server

                apiServerRequests.createGrowthRecord(growthRecordObject)
                    .success(function(data){
                        //update the growth records array locally
                        $scope.growthRecords[index] = data;
                    })
                    .error(function(err){
                        console.log('Error uploading growth record ' +err);

                    });
            //end of check if this is a new growth record object that has not been uploaded to the server
            } else{
            //if growth record object has an id this is an existing entry and we only update the existing object in the database
                apiServerRequests.updateGrowthRecord(growthRecordObject)
                    .success(function(data){
                        alert('Successfully updated');
                    })
                    .error(function(err){
                        console.log('Error updating growth record ' +err);
                    })
            }
        };



        function sortByDate(a, b) {
            return new Date(a.dateGrowth).getTime() - new Date(b.dateGrowth).getTime();
        }

        /**************************/
        /* check values in form  */
        /************************/

        $scope.checkDate = function(date){

            if(date == ''){
                return "Please enter a date";
            }
            //check if a date before the birthday of the baby was selected
            var babyBirthDate = new Date($scope.baby.birthdate);
            var dateSelected = new Date(date);
            var difference =  dateSelected.getTime() - babyBirthDate.getTime();

            if(difference < 0){
                return "The selected date is before the birthday of your baby";
            }
        };

        $scope.checkWeight = function (data) {


            if(data == ''){
                return "Please enter a value";
            } else if(data <= 0){
                return "Please enter a positive value";
            }

        };

        $scope.checkLength = function (data) {


            if(data == ''){
                return "Please enter a value";
            } else if(data <= 0){
                return "Please enter a positive value";
            }

        };

        $scope.checkCfr = function (data) {


            if(data == ''){
                return "Please enter a value";
            } else if(data <= 0){
                return "Please enter a positive value";
            }

        };



    }]);