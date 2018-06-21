var TopicController = ['$scope', '$http', '$interval', '$location', '$window', '$uibModal', 'AdoptionService', 'BaiduApiService', 'AppService',
    function($scope, $http, $interval, $location, $window, $uibModal, adoptionService, baiduApiService, appService) {
        var adoption = null;

        $scope.isContractReady = false;
        $scope.alerts = [];
        $scope.topics = [];
        $scope.categories = [];
        $scope.selectedCategoryId = 0;
        $scope.alertDismissTimeout = 3000;

        var updateTopicList = function(result) {
            var topic = {
                topicId: result[0],
                title: result[1],
                content: result[2],
                category: result[3].toNumber(),
                createdAt: result[4].toNumber(),
                updatedAt: result[5].toNumber(),
                expiredAt: result[6].toNumber(),
                authorName: result[7],
                numPosts: result[8].toNumber()
            };

            if ($scope.selectedCategoryId === 0 || topic.category === $scope.selectedCategoryId) {
                $scope.$apply(function() {
                    $scope.topics.push(topic);
                });
            }
        };

        var tryGetTopics = function() {
            $scope.topics = [];

            adoption.getTopicCount.call().then(function(topicCount) {
                console.log('topicCount: ' + topicCount.toNumber());

                var max_count = Math.max(topicCount.toNumber() - 10, 0);

                for (var i = topicCount.toNumber() - 1; i >= max_count; i--) {
                    adoption.getTopicDetail.call(i).then(updateTopicList);
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
                    },
                    categories: function() {
                        return $scope.categories;
                    },
                    selectedCategoryId: function() {
                        return $scope.selectedCategoryId;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result.action == 'save') {
                    var topic = result.topic;

                    baiduApiService.checkSpam(topic.title + "\r\n" + topic.content, function(result) {
                        if (result && result.passed) {
                            adoption.newTopic(topic.title, topic.content, topic.category, 3600 * 24).then(function(topicId) {
                                console.log(topicId);

                                $scope.alerts.push({
                                    type: 'success',
                                    msg: 'We have received your new post. It will be published to global network, refresh this page later!'
                                });
                            });
                        } else {
                            $scope.alerts.push({
                                type: 'warning',
                                msg: 'Content may have spam content. Please remove it and retry.'
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

        $scope.changeCategory = function(category) {
            $scope.selectedCategoryId = category.id;
            tryGetTopics();
        };

        adoptionService.ready(function(service) {
            adoption = service;

            $scope.$apply(function() {
                $scope.isContractReady = true;
            });

            tryGetTopics();
        });

        adoptionService.initWeb3();
        appService.getCategories(function(categories) {
            $scope.categories = categories;
        });
    }
];

var SaveTopicDialogController = ['$scope', '$uibModalInstance', 'topic', 'categories', 'selectedCategoryId',
    function($scope, $uibModalInstance, topic, categories, selectedCategoryId) {
        $scope.topic = topic || { title: '', content: '', category: selectedCategoryId || 0 };
        $scope.categories = categories;

        $scope.changeCategory = function(category) {
            $scope.topic.category = category.id;
            console.log(category.name);
        };

        $scope.ok = function() {
            $uibModalInstance.close({ action: 'save', topic: $scope.topic });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];