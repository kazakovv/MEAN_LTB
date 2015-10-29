app.controller('DashboardController',['$scope', '$state', function($scope, $state) {

    $scope.init = function () {

        //find kids of current user


        if(Backendless.UserService.getCurrentUser() != null) {
            currentUser = Backendless.UserService.getCurrentUser();
            $scope.kids = currentUser.kids;


            /* alternative approach of getting weights and heights */
            $scope.weightData =[];
            $scope.heightData = [];
            var heightsArray = [];
            var weightsArray = [];
            for (var i=0; i < currentUser.kids.length; i++) {


                var growthRecordsArray = currentUser.kids[i].growthRecords;
                //split the values in the growht records array into separate arrays for weight, lenght and head circumference
                for(k=0; k < growthRecordsArray.length; k++){
                    var weightToPush = {
                        date: new Date(growthRecordsArray[k].dateGrowth),
                        value: growthRecordsArray[k].weight
                    };

                    weightsArray.push(weightToPush);

                    var heightToPush = {
                        date: new Date(growthRecordsArray[k].dateGrowth),
                        value: growthRecordsArray[k].height
                    };
                    heightsArray.push(heightToPush);
                }//end of for loop to split the growth records array into separate arrays
                weightsArray.sort(custom_sort);
                heightsArray.sort(custom_sort);

                var minWeightsArray = {
                    "key": "min Healthy Weight",
                    "bar": true,
                    "values": []
                };
                var maxWeightsArray = {
                    "key": "max Healthy Weight",
                    "bar": true,
                    "values": []
                };

                var minHeightsArray ={
                    "key": "min Healthy Height",
                    "bar": true,
                    "values": []
                };
                var maxHeightsArray = {
                    "key": "max Healthy Height",
                    "bar": true,
                    "values": []
                };
                //set the min and max values for each data point

                for(j=0; j < growthRecordsArray.length; j++){

                    var dateBorn = new Date(currentUser.kids[i].birthdate);
                    var dateWeight = new Date( growthRecordsArray[j].dateGrowth );
                    var months = returnNumberOfMonthsBetweenTwoDates(dateBorn,dateWeight);

                    var minWeight;
                    var maxWeight;
                    var minHeight;
                    var maxHeight;
                    //set min and max values for boy and girl
                    if(currentUser.kids[i].sex==1){
                       //boy
                        minWeight = boyMinWeight(months);
                        maxWeight = boyMaxWeight(months);
                        minHeight = boyMinHeight(months);
                        maxHeight = boyMaxHeight(months);

                    } else {
                        //girl
                        minWeight = girlMinWeight(months);
                        maxWeight = girlMaxWeight(months);
                        minHeight = girlMinHeight(months);
                        maxHeight = girlMaxHeight(months);
                    }

                    //push min and max weight values
                    var minWeightValueToPush = {

                            "date": new Date(dateWeight),
                            "value": minWeight
                        };

                    minWeightsArray.values.push(minWeightValueToPush);

                    var maxWeightValueToPush = {
                        "date": new Date(dateWeight),
                        "value": maxWeight
                    };
                    maxWeightsArray.values.push(maxWeightValueToPush);

                    //push min and max height values

                    var minHeightValueToPush = {

                        "date": new Date(dateWeight),
                        "value": minHeight
                    };

                    minHeightsArray.values.push(minHeightValueToPush);

                    var maxHeightValueToPush = {
                        "date": new Date(dateWeight),
                        "value": maxHeight
                    };
                    maxHeightsArray.values.push(maxHeightValueToPush);



                }//end of loop to set min and max weights  and heights values

                weightsArray.sort(custom_sort);
                var weightDataWithMinAndMaxValues = [

                    {
                        "key" : "Weight",
                        "bar": true,
                        "values" : weightsArray
                    }, maxWeightsArray, minWeightsArray
                ];

                //link the array to scope
                //weightData.sort(custom_sort);
                $scope.weightData.push(weightDataWithMinAndMaxValues);

                //sort the array before we link it to the scope
                //var heightsArray = JSON.parse(currentUser.kids[i].height);
                //heightsArray.sort(custom_sort);

                var heightDataWithMinAndMaxValues = [
                    {
                        "key" : "Height" ,
                        "bar": true,
                        "values" : heightsArray
                    }, maxHeightsArray, minHeightsArray
                ];
                $scope.heightData.push(heightDataWithMinAndMaxValues);


            } //end of for loop to go through all kids
        } else {
            //redirect to login screen
            $state.go('login');
        }


    };

    //the graph
    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 200,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 50
            },
            x: function(d){
                //parses the date into a number format

                return Date.parse(d.date);
            },
            y: function(d){return d.value ;},

            showValues: true,
            valueFormat: function(d){
                return d3.format(',.1f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d) {
                   return d3.time.format('%Y-%m-%d') (new Date(d))
                },
                rotateLabels: 50,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 35,
                tickFormat: function(d){
                    return d3.format(',.1f')(d);
                }
            }
        }
    };
        var returnNumberOfMonthsBetweenTwoDates = function(firstDate,secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            var daysPassed = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            var monthsPassed = daysPassed/30.5;
            return monthsPassed;
        };
    $scope.returnMinAndMaxValues = function(kid, property){
        /*
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

        var birthdate = new Date(kid.birthdate);
        var today = new Date();
        var daysPassed = Math.round(Math.abs((birthdate.getTime() - today.getTime())/(oneDay)));
        var monthsSinceBirthday = Math.round (daysPassed/30.5);
        */

        var birthdate = new Date(kid.birthdate);
        var today = new Date();
        var monthsSinceBirthday = returnNumberOfMonthsBetweenTwoDates(birthdate, today);
        var minWeight;
        var maxWeight;

        var minHeight;
        var maxHeight;

        var sex = kid.sex;
        if(sex == 1){
            //boy
            switch (property){
                case 'Weight':
                    minWeight = boyMinWeight(monthsSinceBirthday);
                    maxWeight = boyMaxWeight(monthsSinceBirthday);
                case 'Height':
                    minHeight = boyMinHeight(monthsSinceBirthday);
                    maxHeight = boyMaxHeight(monthsSinceBirthday);
            } //end of swith statement

        } else if( sex == 2){
            //girl
            switch (property) {
                case 'Weight':
                    minWeight = girlMinWeight(monthsSinceBirthday);
                    maxWeight = girlMaxWeight(monthsSinceBirthday);
                case 'Height':
                    minHeight = girlMinHeight(monthsSinceBirthday);
                    maxHeight = girlMaxHeight(monthsSinceBirthday);
            } //end of switch statement

        } //end of else if for girl
        if(property == 'Weight'){
            return "The healthy range for this age is from " + Math.round(minWeight)  + " to " + Math.round(maxWeight) ;
        } else {
            return "The healthy range for this age is from " + Math.round(minHeight)  + " to " + Math.round(maxHeight) ;
        }
    }; //end of return min and max values function
    //sort the JSON array by date before we pass it on to graph chart
    function custom_sort(a, b) {
        return new Date(a.date) - new Date(b.date);
    }


    /**********************************************************/
    // min and max values for kids
    /* height */
    var boyMinHeight = function(months) {
        var minHeight = -0.1208*(months^2) * 3.1865*months + 47.17;
        return minHeight;
    };

    var boyMaxHeight = function(months){
        var maxHeight = -0.142*(months^2) + 3.8167*months + 55.509;
        return maxHeight;
    };

    var girlMinHeight = function(months){
        var minHeight = -0.1027*(months^2) + 2.965*months + 46.59;
        return minHeight;
    };

    var girlMaxHeight = function(months){
        var maxHeight = -0.1263*(months^2) + 3.5332*months + 54.741;
        return maxHeight;
    };

    /* weight */
    var boyMinWeight = function(months){
        var minWeight = -35.42*(months^2) + 851.24*months + 2359.7;
        return minWeight;
    };

    var boyMaxWeight = function(months){
        var maxWeight = -43.691*(months^2) + 1170.1*months + 4438.8;
        return maxWeight;
    };

    var girlMinWeight = function(months){
        var minWeight = -24.521*(months^2) + 689.71*months + 2341.6;
        return minWeight;
    };

    var girlMaxWeight = function(months){
        var maxWeight = -38.8*(months^2) + 1099*months + 4128.9;
        return maxWeight;
    };


}]);
