/**
 * Created by Victor on 10/1/2015.
 */

app.controller('GrowthRecordController',['$scope', '$state','passObject', 'growthTables',
    function($scope,$state, passObject, growthTables){

        //get baby object passed from the passBaby service
        var babyObject = passObject.getBabyObject();

        var currentUser;

        $scope.init = function () {


            if(typeof babyObject == "undefined"){
                $state.go('login');
            } else {

                $scope.baby = babyObject;
                if(!! babyObject.growthRecords  ){
                    $scope.growthRecords = babyObject.growthRecords;
                    $scope.growthRecords.sort(sortByDate);
                } else{
                    $scope.growthRecords = [];
                }

            }

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

            var babySex = babyObject.sex; //1 male, 2 female
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

            //remove from backendless
            var growthRecordTable = backendlessClasses.growthRecords();
            var growthRecord = Backendless.Persistence.of(growthRecordTable);
            growthRecord.remove(itemToRemove);

        };
        $scope.addValue = function(){
            var growth = backendlessClasses.growthRecords();
            $scope.newValue = new growth;
            $scope.growthRecords.push($scope.newValue);
        };

        $scope.sortGrowthArray = function(){
          $scope.growthRecords.sort(sortByDate);
        };

        $scope.saveProperties = function(){



            //****** upload in backendless *****

            //get baby table from backendlessClasses service
            var Baby = backendlessClasses.babyTable();
            babyObject.growthRecords = $scope.growthRecords;
            babyObject = angular.copy(babyObject); //remove $$hashkey added by angular
            var saved = Backendless.Persistence.of( Baby ).save( babyObject, new Backendless.Async( savedBaby, gotError ));
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