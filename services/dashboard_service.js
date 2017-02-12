var app = angular.module('liveScoreApp');

app.factory('apiService', ['$http', '$q','appConfig', function ($http, $q, appConfig) {
    var apiService = {};
    var footBallData = function () {
        var deferred = $q.defer();
        $http({
        	method: 'GET',
        	headers: { 'X-Auth-Token': appConfig.footBallKey, 'X-Response-Control': 'full' },
        	url: appConfig.footBallBase + "competitions"
        }).then(function (response) {
            deferred.resolve(response);
        },
            function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    };
    var getResource = function(url){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            headers: {'X-Auth-Token': appConfig.footBallKey},
            url: url
        }).then(function(response) {
            deferred.resolve(response)
        }).catch(function(e) {
            deferred.reject(e);
        });
        return deferred.promise;
    }
    var fetchCompTeams = function(compId){
    	var deferred = $q.defer();
    	$http({
    		method: 'GET',
            // headers: {'X-Auth-Token': appConfig.footBallKey, 'X-Response-Control': 'minified'},
    		headers: {'X-Auth-Token': appConfig.footBallKey},
    		url: appConfig.footBallBase + "competitions/"+compId+"/leagueTable"
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
    apiService.getResource = getResource; 
    return apiService;
}]);