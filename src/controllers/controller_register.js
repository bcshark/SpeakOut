"use strict";

var RegisterController = ['$scope', '$http', '$interval', '$location', 'PosterService',
    function($scope, $http, $interval, $location, posterService) {
        var adoption = null;

        var tryGetRegisteredName = function() {
            // check whether account is already registered
            web3.eth.getAccounts(function(error, accounts) {
                if (error) {
                    console.log(error);
                }

                var account = accounts[0];

                adoption.getPosterName(account).then(function(posterName) {
                    $scope.$apply(function() {
                        $scope.username = posterName;
                    });
                });
            });
        };

        $scope.register = function() {
            var test = adoption.newPoster($scope.username).then(function(receipt) {
                console.log(receipt);

                $scope.$apply(function() {
                    $location.path('/topics');
                });
            }).catch(function(err) {
                console.log(err.message);
            });
        };

        posterService.ready(function(service) {
            console.log('contract is ready.');
            adoption = service;

            tryGetRegisteredName();
        });

        posterService.initWeb3();
    }
];