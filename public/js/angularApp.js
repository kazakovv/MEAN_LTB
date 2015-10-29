/**
 * Created by Victor on 9/8/2015.
 */
var app = angular.module('LittleBabyDiary', ['ui.router', 'nvd3', 'xeditable', 'ui.bootstrap']);

app.run(function(editableOptions, $rootScope) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    $rootScope.currentUser = {};

});

//routes for the various pages
app.config([
    '$stateProvider',
    '$urlRouterProvider',function ($stateProvider,$urlRouterProvider ){
        $stateProvider
            .state('/', {
                url: '/main',
                controller: 'MainController',
                templateUrl: 'views/main.html'
            })
            .state('login',{
                url: '/login',
                controller: 'LogInController',
                templateUrl: 'views/login.html'
            })
            .state('signup',{
                url: '/signup',
                controller: 'SignUpController',
                templateUrl: 'views/signup.html'
            })
            .state('dashboard',{
                url: '/dashboard',
                controller: 'DashboardController',
                templateUrl: 'views/dashboard.html'
            })
            .state('kids',{
                url: '/kids',
                controller: 'CreateKidsController',
                templateUrl: 'views/createkids.html'
            })
            .state('growthrecord', {
                url:'/growthrecord',
                controller: 'GrowthRecordController',
                templateUrl: 'views/growthrecord.html'
            })
            .state('developmentrecord',{
                url:'/developmentrecord',
                controller: 'DevelopmentRecordController',
                templateUrl: 'views/developmentrecord.html'
            })
            .state('feverrecord', {
                url:'/feverrecord',
                controller: 'FeverRecordController',
                templateUrl: 'views/feverrecord.html'
            })
            .state('data',{
                url: '/data',
                controller: 'DataController',
                templateUrl: 'views/data.html'
            });


        $urlRouterProvider.otherwise('login');



    }]);




