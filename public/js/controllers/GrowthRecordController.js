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

        $scope.calculatePercentile = function(record,percentileToCalculate){
            //check if this is a new row and exit if yes
            if(! record.dateGrowth) {
                return;
            }
            var birthDate = new Date($scope.baby.birthdate);
            var dateEntered = new Date(record.dateGrowth);
            var day = 1000 * 3600 * 24;
            var differenceInDays = Math.round( ( dateEntered.getTime() - birthDate.getTime() )/day );
            var monthsSinceBirth = differenceInDays/30.5;
            var percentile;
            //return percentile based on boy/girl and weight, height or head circumference

            var babySex = babyObject.boy_girl; //1 male, 2 female
            switch (percentileToCalculate){
                case "Weight":
                    if(babySex == 1){
                        percentile = growthTables.percentileBoysWeight(monthsSinceBirth, record.weight);
                    } else {
                        percentile = growthTables.percentileGirlsWeight(monthsSinceBirth, record.weight);
                    }
                    return percentile;
                    break;
                case "Height":
                    if(babySex == 1){
                        percentile = growthTables.percentileBoysHeight(monthsSinceBirth, record.height);
                    } else {
                        percentile = growthTables.percentileGirlsHeight(monthsSinceBirth, record.height);
                    }
                    return percentile;
                    break;
                case "HeadCircumference":
                    if(babySex == 1){
                        percentile = growthTables.percentileBoysHeadCircumference(monthsSinceBirth, record.cfr);
                    } else {
                        percentile = growthTables.percentileGirlsHeadCircumference(monthsSinceBirth, record.cfr);
                    }
                    return percentile;
                    break;
            }//end of switch statement to calculate the respective percentile

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

        $scope.saveGrowthRecord = function(index){
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

        $scope.checkDate = function(data){

            if(data == ''){
                return "Please enter a date";
            }
            //check if a date before the birthday of the baby was selected
            var babyBirthDate = new Date($scope.baby.birthdate);
            var dateSelected = new Date(data);
            var difference =  dateSelected.getDate() - babyBirthDate.getDate();

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