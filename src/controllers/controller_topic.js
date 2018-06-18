"use strict";

var TopicController = ['$scope', '$http', '$interval', '$location', '$window', '$uibModal', 'AdoptionService', 'BaiduApiService',
    function($scope, $http, $interval, $location, $window, $uibModal, adoptionService, baiduApiService) {
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
                            topicId: result[0],
                            title: result[1],
                            content: result[2],
                            createdAt: result[3].toNumber(),
                            updatedAt: result[4].toNumber(),
                            expiredAt: result[5].toNumber(),
                            authorName: result[6]
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

                    baiduApiService.checkSpam(topic.title + "\r\n" + topic.content, function(result) {
                        if (result && result.passed) {
                            adoption.newTopic(topic.title, topic.content, 3600 * 24).then(function(topicId) {
                                console.log(topicId);

                                $scope.alerts.push({
                                    type: 'success',
                                    msg: 'We have received your new post. It will be published to global network, refresh this page later!'
                                });
                            });
                        } else {
                            $scope.alerts.push({
                                type: 'warning',
                                msg: 'Content could have spam content. Please remove it and retry.'
                            });
                        }
                    });
                }
            }, function() {
                // dialog cancelled                         
            });
        };

        $scope.showTopicDetail = function(topic) {
            $location.path('/topic/' + topic.topicId);
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
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