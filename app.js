var app = angular.module('liveScoreApp',['ui.router']);
//app.value(KEY_ID, "e225fd62154641df886b29b946d8c36c");

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
            controller: 'dashboardCtrl',
			templateUrl: 'templates/dashboard.html'
		})
		.state('dashboard.competition', {
			url: '/competition',
			templateUrl: 'templates/competition.html'
		})
        .state('dashboard.team', {
            url: '/teams',
            templateUrl: 'templates/team.html'
        })
        .state('dashboard.league_table', {
            url: '/league_table',
            templateUrl: 'templates/league_table.html'
        });
	$urlRouterProvider.otherwise('/dashboard/competition');

    $httpProvider.interceptors.push(function ($q) {
        return {
            'request': function (config) {
                if (config.url.split(':')[0] === 'http') {
                    config.url = config.url.replace('http', 'https')
                }
                return config || $q.when(config);
            }

        }
    });
}]);

app.filter('teamFilter',function(){
    return function(teamName, fixture) {
        return fixture.awayTeamName === teamName ? fixture.homeTeamName : fixture.awayTeamName
        // return "hii";
    }
})

app.controller('dashboardCtrl',['$scope', '$http', 'apiService', '$state', function ($scope, $http, apiService, $state) {
	$scope.dashboard = {};
    $scope.dashboard.competitions = [];
	apiService.footBallData().then(function(response) {
        console.log(" success!", response);
        console.log(" length", response.data.length);
        for(var i = 0; i < response.data.length; i++){
        	$scope.dashboard.competitions.push({
        		comp_ID: response.data[i].id,
        		comp_name: response.data[i].caption,
        		num_games: response.data[i].numberOfGames,
        		match_days: response.data[i].numberOfMatchdays,
        		num_team: response.data[i].numberOfTeams,
                leagueUrl: response.data[i]._links.leagueTable.href
        	});
        }
        console.log($scope.dashboard.competitions);            
    },
        function (err) {
            console.log(err);
        }
    );

    $scope.showLeagueTable = function(leagueUrl) {
        apiService.getResource(leagueUrl).then(function(response) {
            $scope.dashboard.leagueTable = response.data;
            $scope.dashboard.leagueCaption = response.data.leagueCaption;
            $scope.standingGroup = false;
            $scope.standingList = false;
            $scope.noStandingList = false;

            if (response.data.standings !== undefined) {
                // group table
                $scope.dashboard.leagueGroupStanding = response.data.standings;
                $scope.standingGroup = true;
                $scope.standingList = false;
                $scope.noStandingList = false;
                console.log(response.data.standings);
            }
            else {
                $scope.dashboard.leagueStanding = response.data.standing;
                $scope.standingList = true;
                $scope.standingGroup = false;
                $scope.noStandingList = false;
            }
            console.log("standing is:", $scope.dashboard.leagueStanding);
            $state.go('dashboard.league_table');
        },
            function(error) {
                console.log('League Table does not exist for this competition!');
                $scope.noStandingList = true;
                $scope.standingGroup = false;
                $scope.standingList = false;
                $state.go('dashboard.league_table');
            }
        );
    }

	$scope.showTeamDetail = function(teamURL){
    	apiService.getResource(teamURL).then(function(response) {
            var playerURL, fixtureURL;
            console.log(" success team data !", response);
            $scope.teamDetail = response.data;
           // $state.go('dashboard.teams')
            playerURL = response.data._links.players.href;
            fixtureURL = response.data._links.fixtures.href;
            apiService.getResource(playerURL).then(function(playerRes) {
                console.log("playerRes",playerRes);
                $scope.dashboard.player = playerRes.data.players;
            },
                function(error){
                    console.log(error);
                }
            );
            apiService.getResource(fixtureURL).then(function(fixtureRes) {
                console.log("fixtureRes",fixtureRes);
                $scope.dashboard.fixture = fixtureRes.data.fixtures;
            },
                function(error){
                    console.log(error);
                }
            );
            $state.go('dashboard.team');
        },
            function (err) {
                console.log(err);
            }
        );
    };
}]);