app.controller('DashboardController', ['$scope', '$state', 'passObject', 'apiServerRequests',
    function($scope, $state, passObject, apiServerRequests) {

        var getGrowthDataAndCreateArraysForCharts = function(kids){
            //this function downloads the data and puts it into the format that nvd3 needs for displaying the charts

            /* alternative approach of getting weights and heights */
            $scope.weightData =[];
            $scope.heightData = [];

            for (var i=0; i < kids.length; i++) {
                var kid = kids[i];

                apiServerRequests.getGrowthRecordsForBaby(kid._id)
                    .success(function(growthRecords){
                        var heightsArray = [];
                        var weightsArray = [];

                        for(var k=0; k < growthRecords.length; k++){
                            var weightToPush = {
                                date: new Date(growthRecords[k].dateGrowth),
                                value: growthRecords[k].weight
                            };
                            weightsArray.push(weightToPush);

                            var heightToPush = {
                                date: new Date(growthRecords[k].dateGrowth),
                                value: growthRecords[k].height
                            };
                            heightsArray.push(heightToPush);

                            weightsArray.sort(custom_sort);
                            heightsArray.sort(custom_sort);



                        }//end of for loop for going through the downloaded growth records

                        //build the arrays needed to display the graph
                        $scope.weightData.push([
                            {
                                "key" : "Height" ,
                                "bar": true,
                                "values" : weightsArray
                            }]);

                        $scope.heightData.push ([
                            {
                                "key" : "Weight",
                                "bar" : true,
                                "values" : heightsArray
                            }]);

                    })//end of success callback
                    .error(function(err){
                       console.log('Error downloading growth record for ' + kid.name + ' err: ' +err);
                    });//end of query to download growth records



            } //end of for loop to go through all kids
        }; //end of function for getting the data for the kids


    $scope.init = function () {

        //find kids of current user
        if(passObject.getCurrentUser() != null) {
            $scope.currentUser = passObject.getCurrentUser();
            //get kids for user from database
            apiServerRequests.getKidsForParent($scope.currentUser._id)
                .success(function(kids){
                    $scope.kids = kids;
                    getGrowthDataAndCreateArraysForCharts(kids);
                })
                .error(function(err){
                    console.log('error getting kids for current user '+err);
                });//end of query to get kids of a parent

        } else {
            //redirect to login screen
            $state.go('login');
        }


    }; //end of init function

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

    //sort the JSON array by date before we pass it on to graph chart
    function custom_sort(a, b) {
        return new Date(a.date) - new Date(b.date);
    }




}]);
