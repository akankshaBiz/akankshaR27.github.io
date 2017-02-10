var app = angular.module('liveScoreApp',['ui.router']);
//app.value(KEY_ID, "e225fd62154641df886b29b946d8c36c");

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'dashboard.html',
			controller: 'dashboardCtrl'
		})
		.state('dashboard.competition', {
			url: '/competition',
			controller: 'dashboardCtrl',
			templateUrl: 'templates/competition.html'
		});
	$urlRouterProvider.otherwise('/dashboard/competition');
}])

app.controller('dashboardCtrl',function ($scope,$http,apiService) {
	$scope.comp_list = [];
	$scope.competition = {};
	apiService.footBallData().then(function(data) {
        console.log(" success!", data);
        console.log(" length", data.data.length);
        for(var i=0; i<data.data.length;i++){
        	$scope.comp_list.push({
        		comp_ID: data.data[i].id,
        		comp_name: data.data[i].caption,
        		num_games: data.data[i].numberOfGames,
        		match_days: data.data[i].numberOfMatchdays,
        		num_team: data.data[i].numberOfTeams
        	});
        }
        console.log($scope.comp_list);            
    },
        function (err) {
            console.log(err);
        }
    );
	$scope.fetchTeams = function(comp_id){

	apiService.fetchCompTeams(comp_id).then(function(data) {
        console.log(" success team data !", data);           
        },
            function (err) {
                console.log(err);
            }
        );
	}
});