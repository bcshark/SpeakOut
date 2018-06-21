"use strict";

var RegisterController = ['$scope', '$http', '$interval', '$location', 'AdoptionService',
    function($scope, $http, $interval, $location, adoptionService) {
        var adoption = null;

        $scope.isContractReady = false;
        $scope.isUserRegistered = false;
        $scope.alerts = [];
        $scope.alertDismissTimeout = 3000;
        $scope.user = {};

        var tryGetBalance = function() {
            adoption.getBalance().then(function(balance) {
                $scope.$apply(function() {
                    $scope.user.balance = balance.toNumber();
                });
            });
        };

        var tryGetRegisteredName = function() {
            // check whether account is already registered
            web3.eth.getAccounts(function(error, accounts) {
                if (error) {
                    console.log(error);
                }

                var account = accounts[0];

                adoption.getPosterName(account).then(function(posterName) {
                    if (posterName !== undefined && posterName !== null && posterName !== '') {
                        tryGetBalance();

                        $scope.$apply(function() {
                            $scope.user.username = posterName;
                            $scope.isUserRegistered = true;
                        });
                    }
                });
            });
        };

        $scope.enter = function() {
            if (!$scope.isContractReady || !$scope.isUserRegistered) return;

            $location.path('/topics');
        };

        $scope.register = function() {
            if (!$scope.isContractReady) return;

            var test = adoption.newPoster($scope.user.username).then(function(receipt) {
                console.log(receipt);

                $scope.$apply(function() {
                    $location.path('/topics');
                });
            }).catch(function(err) {
                console.log(err.message);
            });
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        adoptionService.ready(function(service) {
            adoption = service;

            $scope.$apply(function() {
                $scope.alerts.push({
                    type: 'success',
                    msg: 'Successfully open contract!'
                });
                $scope.isContractReady = true;
            });

            tryGetRegisteredName();
        });

        adoptionService.initWeb3();
    }
];