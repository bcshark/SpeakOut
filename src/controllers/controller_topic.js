"use strict";

var TopicController = ['$scope', '$http', '$interval', '$location', '$window', '$uibModal', 'AdoptionService',
    function($scope, $http, $interval, $location, $window, $uibModal, adoptionService) {
        var adoption = null;

        $scope.isContractReady = false;
        $scope.alerts = [];
        $scope.topics = [];

        var tryGetTopics = function() {
            adoption.getTopicCount.call().then(function(topicCount) {
                console.log('topicCount: ' + topicCount.toNumber());

                var max_count = Math.max(topicCount.toNumber() - 10, 0);

                for (var i = topicCount.toNumber() - 1; i >= max_count; i--) {
                    adoption.getTopicDetail.call(i).then(function(result) {
                        console.log(result);

                        var topic = {
                            title: result[0],
                            content: result[1],
                            createdAt: result[2].toNumber(),
                            updatedAt: result[3].toNumber(),
                            expiredAt: result[4].toNumber(),
                            authorName: result[5]
                        };

                        $scope.$apply(function() {
                            $scope.topics.push(topic);
                        });
                    });
                }
            });
        };

        $scope.showSaveTopicDialog = function(topic) {
            if (!$scope.isContractReady) return;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'SaveTopicDialog.html',
                controller: SaveTopicDialogController,
                resolve: {
                    topic: function() {
                        return topic;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result.action == 'save') {
                    var topic = result.topic;
                    var nowInMillseconds = new Date().getTime();

                    adoption.newTopic(topic.title, topic.content, nowInMillseconds, nowInMillseconds + 3600 * 24 * 1000).then(function(topicId) {
                        console.log(topicId);
                    });
                }
            }, function() {
                // dialog cancelled                         
            });

        };

        adoptionService.ready(function(service) {
            adoption = service;

            $scope.$apply(function() {
                $scope.isContractReady = true;
            });

            tryGetTopics();
        });

        adoptionService.initWeb3();
    }
];

var SaveTopicDialogController = ['$scope', '$uibModalInstance', 'topic',
    function($scope, $uibModalInstance, topic) {
        $scope.topic = topic || { title: '', content: '' };

        $scope.ok = function() {
            $uibModalInstance.close({ action: 'save', topic: $scope.topic });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];