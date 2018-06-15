"use strict";

var TopicViewController = ['$scope', '$http', '$interval', '$location', '$window', '$routeParams', '$uibModal', 'AdoptionService',
    function($scope, $http, $interval, $location, $window, $routeParams, $uibModal, adoptionService) {
        var adoption = null;

        $scope.topicId = $routeParams['topicId'];
        $scope.isContractReady = false;
        $scope.comments = [];

        var tryGetTopicDetail = function() {
            adoption.getTopicDetail.call($scope.topicId).then(function(result) {
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
                    $scope.topic = topic;
                });
            });
        };

        var tryGetComments = function() {
            adoption.getPostCountByTopic.call($scope.topicId).then(function(postCount) {
                console.log('postCount: ' + postCount.toNumber());

                var max_count = Math.max(postCount.toNumber() - 10, 0);

                for (var i = postCount.toNumber() - 1; i >= max_count; i--) {
                    adoption.getPostDetail.call($scope.topicId, i).then(function(result) {
                        console.log(result);

                        var comment = {
                            postId: result[0],
                            content: result[1],
                            createdAt: result[2].toNumber(),
                            mark: result[3].toNumber(),
                            tips: result[4].toNumber(),
                            authorName: result[5]
                        };

                        $scope.$apply(function() {
                            $scope.comments.push(comment);
                        });
                    });
                }
            });
        };

        $scope.backToTopics = function() {
            $location.path('/topics/');
        }

        $scope.showSaveCommentDialog = function(comment) {
            if (!$scope.isContractReady) return;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'SaveCommentDialog.html',
                controller: SaveCommentDialogController,
                resolve: {
                    comment: function() {
                        return comment;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result.action == 'save') {
                    var comment = result.comment;

                    adoption.newPost($scope.topicId, comment.content, comment.mark, comment.tips).then(function(postId) {
                        console.log(postId);
                    });
                }
            }, function() {
                // dialog cancelled                         
            });
        }

        adoptionService.ready(function(service) {
            adoption = service;

            $scope.$apply(function() {
                $scope.isContractReady = true;
            });

            tryGetTopicDetail();
            tryGetComments();
        });

        adoptionService.initWeb3();
    }
];

var SaveCommentDialogController = ['$scope', '$uibModalInstance', 'comment',
    function($scope, $uibModalInstance, comment) {
        $scope.comment = comment || { content: '', mark: 5, tips: 0 };

        $scope.ok = function() {
            $uibModalInstance.close({ action: 'save', comment: $scope.comment });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];