/**
 * Created by Victor on 10/13/2015.
 */
app.factory('growthTables', ['growthTablesData','MathFunctions', function(growthTablesData, mathFunctions) {

    //get tables with values
    var boysWeightTable = growthTablesData.getBoysWeightTable();
    var boysHeightTable = growthTablesData.getBoysHeightTable();
    var boysHeadCircumference = growthTablesData.getBoysHeadCircumference();
    var girlsWeightTable = growthTablesData.getGirlsWeightTable();
    var girlsHeightTable = growthTablesData.getGirlsHeightTable();
    var girlsHeadCircumference = growthTablesData.getGirlsHeadCircumference();

    //function that searches growth tables and finds closes L,M,S values based on the month
    function growthParameterSearch(growthTableArrayToSearch, month, parameterToReturn){

        //run through all the values in the array to find the closest matching month in the table
        for (i = 0; i < growthTableArrayToSearch.length; i++){
            //check if we have reached the end of the array
            if(i != growthTableArrayToSearch.length){
                //look for the closest month in the array
                var thisMonthDifference = Math.abs(month - growthTableArrayToSearch[i].Month);
                var nextMonthDifference = Math.abs(month - growthTableArrayToSearch[i+1].Month);
                //look for the smallest absolute difference
                if(thisMonthDifference < nextMonthDifference){
                    //return the corresponding value
                    switch (parameterToReturn){
                        case "L":
                            return growthTableArrayToSearch[i].L;
                            break;
                        case "M":
                            return growthTableArrayToSearch[i].M;
                            break;
                        case "S":
                            return growthTableArrayToSearch[i].S;
                            break;

                    }//end of switch statement

                }
            } else { //end of check whether the end of the array was reached
                //if we reached the end of the array the closest match must be the last value
                //return the corresponding value
                switch (parameterToReturn){
                    case "L":
                        return growthTableArrayToSearch[i].L;
                        break;
                    case "M":
                        return growthTableArrayToSearch[i].M;
                        break;
                    case "S":
                        return growthTableArrayToSearch[i].S;
                        break;

                }//end of switch statement

            } //end of else statement

        } //end of for look to search for the closest match in months

    }; //end of growhTableParameterSearch function

    function calculatePercentile(X, M, S, L){
        //function that calculates the percentile based on the inputs

        // 1. calculate the z-score
        // formula z = [(X/M)^L - 1] / (L*S)
        var z_score = ( Math.pow(X/M, L) - 1)/(L*S);
        //2. calculate the percentile based on the normal cumulative distribution function
        var cdf = mathFunctions.CumulativeDistributionFunction(z_score,0,1);
        return cdf;

    } //end of calculate percentile function

    function boysWeightPercentile(month, Weight){
        var L = growthParameterSearch(boysWeightTable, month,"L"); // power in the Box-Cox transformation
        var M = growthParameterSearch(boysWeightTable, month,"M"); // mean
        var S = growthParameterSearch(boysWeightTable, month,"S"); // standard deviation

        return calculatePercentile(Weight, M, S, L);


    }//end of boys weight percentile function
    function boysHeightPercentile(month, Height){
        var L = growthParameterSearch(boysHeightTable, month,"L"); // power in the Box-Cox transformation
        var M = growthParameterSearch(boysHeightTable, month,"M"); // mean
        var S = growthParameterSearch(boysHeightTable, month,"S"); // standard deviation

        return calculatePercentile(Height, M, S, L);


    }//end of boys height percentile function
    function boysHeadCircumferencePercentile(month, headCircumference){
        var L = growthParameterSearch(boysHeadCircumference, month,"L"); // power in the Box-Cox transformation
        var M = growthParameterSearch(boysHeadCircumference, month,"M"); // mean
        var S = growthParameterSearch(boysHeadCircumference, month,"S"); // standard deviation

        return calculatePercentile(headCircumference, M, S, L);


    }//end of boys head circumference percentile function

    function girlsWeightPercentile(month, Weight){
        var L = growthParameterSearch(girlsWeightTable, month,"L"); // power in the Box-Cox transformation
        var M = growthParameterSearch(girlsWeightTable,month,"M"); // mean
        var S = growthParameterSearch(girlsWeightTable, month,"S"); // standard deviation

        return calculatePercentile(Weight, M, S, L);


    }//end of girls weight percentile function

    function girlsHeightPercentile(month, Height){
        var L = growthParameterSearch(girlsHeightTable, month,"L"); // power in the Box-Cox transformation
        var M = growthParameterSearch(girlsHeightTable,month,"M"); // mean
        var S = growthParameterSearch(girlsHeightTable, month,"S"); // standard deviation

        return calculatePercentile(Height, M, S, L);


    }//end of girls height percentile function

    function girlsHeadCircumferencePercentile(month, headCircumference){
        var L = growthParameterSearch(girlsHeadCircumference, month,"L"); // power in the Box-Cox transformation
        var M = growthParameterSearch(girlsHeadCircumference,month,"M"); // mean
        var S = growthParameterSearch(girlsHeadCircumference, month,"S"); // standard deviation

        return calculatePercentile(headCircumference, M, S, L);

    }//end of girls height percentile function
    function calculatePercentileFunction(dateGrowthRecord, babyBirthday, valueGrowthRecord, percentileToCalculate, boy_girl){
        //check for empty inputs
        if(!dateGrowthRecord || ! percentileToCalculate || ! babyBirthday || ! valueGrowthRecord || ! boy_girl ){
            return;
        }

        babyBirthday = new Date(babyBirthday);
        dateGrowthRecord = new Date(dateGrowthRecord);
        var day = 1000 * 3600 * 24;
        var differenceInDays = Math.round( ( dateGrowthRecord.getTime() - babyBirthday.getTime() )/day );
        var monthsSinceBirth = differenceInDays/30.5;
        var percentile;
        //return percentile based on boy/girl and weight, height or head circumference

         //boy_gil variable : 1 male, 2 female
        switch (percentileToCalculate){
            case "Weight":
                if(boy_girl == 1){
                    percentile = boysWeightPercentile(monthsSinceBirth, valueGrowthRecord);
                } else {
                    percentile = girlsWeightPercentile(monthsSinceBirth, valueGrowthRecord);
                }
                return percentile;
                break;
            case "Height":
                if(boy_girl == 1){
                    percentile = boysHeightPercentile(monthsSinceBirth, valueGrowthRecord);
                } else {
                    percentile = girlsHeightPercentile(monthsSinceBirth, valueGrowthRecord);
                }
                return percentile;
                break;
            case "HeadCircumference":
                if(boy_girl == 1){
                    percentile = boysHeadCircumferencePercentile(monthsSinceBirth, valueGrowthRecord);
                } else {
                    percentile = girlsHeadCircumferencePercentile(monthsSinceBirth, valueGrowthRecord);
                }
                return percentile;
                break;
        }//end of switch statement to calculate the respective percentile


    }//end of calculate percentile function
    /*** exposed return functions ****/

    return{
        calculatePercentile: function(dateGrowthRecord, babyBirthday, valueGrowthRecord, percentileToCalculate, boy_girl){
            var percentile = calculatePercentileFunction(dateGrowthRecord, babyBirthday,
                valueGrowthRecord, percentileToCalculate, boy_girl);
            return percentile;
        },

        /* todo These are not needed and could be deleted */
        percentileBoysWeight: function(month, Weight){
            var percentile = boysWeightPercentile(month,Weight);
            return percentile;
        },
        percentileBoysHeight: function(month, Height){
            var percentile = boysHeightPercentile(month,Height);
            return percentile;
        },
        percentileBoysHeadCircumference: function(month, HeadCircumference){
            var percentile = boysHeadCircumferencePercentile(month, HeadCircumference);
            return percentile;
        },
        percentileGirlsWeight: function(month, Weight){
            var percentile = girlsWeightPercentile(month,Weight);
            return percentile;
        },
        percentileGirlsHeight: function(month, Height){
            var percentile = girlsHeightPercentile(month, Height);
            return percentile;
        },
        percentileGirlsHeadCircumference: function(month, HeadCircumference){
            var percentile = girlsHeadCircumferencePercentile(month, HeadCircumference);
            return percentile;
        }
    }; //end of return function that exposes the functions in the service

}]);
