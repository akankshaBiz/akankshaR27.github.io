var app = angular.module('myApp',[]);
//app.value(KEY_ID, "e225fd62154641df886b29b946d8c36c");
app.factory('apiService', ['$http', '$q', function ($http, $q) {
    var apiService = {};
    var footBallData = function () {
        var deferred = $q.defer();
        $http({
        	method: 'GET',
        	headers: { 'X-Auth-Token': 'e225fd62154641df886b29b946d8c36c' },
        	url: "http://api.football-data.org/v1/soccerseasons",
        	params: {apiKey: "e225fd62154641df886b29b946d8c36c"}
        	
        }).then(function (response) {
            deferred.resolve(response);
        },
            function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    };
    var fetchCompTeams = function(compId){
    	var deferred = $q.defer();
    	$http({
    		method: 'GET',
    		headers: {'X-Auth-Token': 'e225fd62154641df886b29b946d8c36c'},
    		url: "http://api.football-data.org/v1/competitions/"+compId+"/leagueTable",
    		params: {apiKey: "e225fd62154641df886b29b946d8c36c"}
    	}).then(function(response){
    		deferred.resolve(response);
    	},
    		function(error){
    			deferred.reject(error);
    		}
    	);
    	return deferred.promise;
    };

    apiService.footBallData = footBallData;
    apiService.fetchCompTeams = fetchCompTeams;
    return apiService;
}]);

app.controller('dashboardCtrl',function ($scope,$http,apiService ) {
	$scope.comp_list = [];
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