angular.module('SpeakOutApp', ['ngRoute', 'ngResource', 'cgBusy', 'ui.bootstrap'])

.controller('MainController', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
})
.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/topics.html',
			controller: TopicController,
		})
		.when('/register', {
			templateUrl: 'views/register.html',
			controller: RegisterController,
		});
});
