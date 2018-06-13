angular.module('SpeakOutApp', ['ngRoute', 'ngResource', 'cgBusy', 'ui.bootstrap'])

.service('ConfigService', ConfigService)
.service('AdoptionService', AdoptionService)
.controller('MainController', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
})
.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/register.html',
			controller: RegisterController,
		})
		.when('/topics', {
			templateUrl: 'views/topics.html',
			controller: TopicController,
		})
		.when('/topic/:topicId', {
			templateUrl: 'views/topic_view.html',
			controller: TopicViewController,
		});
});
