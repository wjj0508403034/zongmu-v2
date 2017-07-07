'use strict';

huoyun.directive("widgetsVideoPlayerControlBar", ["VideoEventName", "MarkObject",
  function(VideoEventName, MarkObject) {
    return {
      restrict: "A",
      templateUrl: "video/video.player.control.bar.html",
      scope: {
        "channels": "=",
        "shapeGroupStore": "=ngModel"
      },
      link: function($scope, elem, attrs) {
        $scope.video = null;

        $scope.onVideoLoaded = function(video) {
          $scope.video = video;
        };

        $scope.onVideoChanged = function(video) {
          $scope.video = video;
        };

        $scope.onPlayButtonClicked = function() {
          $scope.$broadcast(VideoEventName.Play);
        };

        $scope.onPauseButtonClicked = function() {
          $scope.$broadcast(VideoEventName.Pause);
        };

        $scope.onPreviousFrameButtonClicked = function() {
          $scope.$broadcast(VideoEventName.PreviousFrame);
        };

        $scope.onNextFrameButtonClicked = function() {
          $scope.$broadcast(VideoEventName.NextFrame);
        };

        $scope.onChangeRateButtonClicked = function(rate) {
          $scope.$broadcast(VideoEventName.ChangeRate, rate);
        };

        $scope.onFastFastForwardButtonClicked = function() {
          $scope.$broadcast(VideoEventName.FastFastForward);
        };

        $scope.onFastForwardButtonClicked = function() {
          $scope.$broadcast(VideoEventName.FastForward);
        };

        $scope.onFastBackwardButtonClicked = function() {
          $scope.$broadcast(VideoEventName.FastBackward);
        };

        $scope.onFastFastBackwardButtonClicked = function() {
          $scope.$broadcast(VideoEventName.FastFastBackward);
        };

      }
    }
  }
]);