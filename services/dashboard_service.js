var app = angular.module('liveScoreApp');

app.factory('apiService', ['$http', '$q', 'appConfig', function ($http, $q, appConfig) {
    var apiService = {};
    var footBallData = function () {
        var deferred = $q.defer();
        $http({
        	method: 'GET',
        	headers: { 'X-Auth-Token': appConfig.footBallKey },
        	url: appConfig.footBallBase + "soccerseasons",
        	params: {apiKey: appConfig.footBallKey}
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
    		headers: {'X-Auth-Token': appConfig.footBallKey, 'X-Response-Control': 'minified'},
    		url: appConfig.footBallBase + "competitions/"+compId+"/leagueTable",
    		params: {apiKey: appConfig.footBallKey}
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