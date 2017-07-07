'use strict';

/*
 * http://www.w3school.com.cn/tags/html_ref_eventattributes.asp
 *
 */
huoyun.directive("widgetsVideoPlayer", ["$sce", "$log", "$timeout", "VideoEventName", "Video", "$injector", "ShapeEventName", "MarkObject", "MarkFactory",
  function($sce, $log, $timeout, VideoEventName, Video, $injector, ShapeEventName, MarkObject, MarkFactory) {

    const STEP = 5;
    const FAST_STEP = STEP * 2;

    return {
      restrict: "A",
      templateUrl: "video/video.player.html",
      scope: {
        "channel": "=",
        "onVideoChanged": "&",
        "loaded": "&",
        "onError": "&",
        "shapeGroupStore": "=ngModel"
      },
      link: function($scope, elem, attrs) {
        $scope.currentShape = null;

        $scope.onNewShapeButtonClicked = function() {
          $scope.$broadcast(ShapeEventName.CREATE);
        };

        $scope.onGroupShapeChanged = function() {
          if ($scope.shapeGroupStore.current && $scope.currentShape) {
            $scope.shapeGroupStore.move($scope.currentShape);
            $scope.shapeGroupStore.current.select();
          }
        };

        $scope.onShapeCreateCallback = function(shape) {
          $scope.currentShape = shape;
          shape.setChannel($scope.channel);
          var shapeGroup = MarkFactory.newShapeGroup(shape);
          $scope.shapeGroupStore.addCurrent(shapeGroup);
        };

        $scope.onShapeSelectedChanged = function(shape) {
          $scope.currentShape = shape;
          $scope.shapeGroupStore.current = null;
        };

        var videoElement = elem.find("video")[0];
        videoElement.onloadedmetadata = function(e) {
          e.preventDefault();
          $log.info("Video metadata is loaded", e);
          $scope.video = new Video($injector, videoElement);
          $timeout(function() {
            $scope.loaded({
              video: $scope.video
            });
          });
        };

        videoElement.oncanplaythrough = function(e) {
          $log.info("Video can play through");
        };

        videoElement.ontimeupdate = function(e) {
          e.preventDefault();

          if ($scope.video) {
            $scope.video.setCurrentTime(videoElement.currentTime);
            $timeout(function() {
              $scope.onVideoChanged({
                video: $scope.video
              });
            });
          }
        };

        videoElement.onloadeddata = function(e) {
          $log.info("Video loaded data.", e);
        };

        videoElement.onended = function(e) {
          $log.info("Video ended.", e);
        };

        videoElement.onerror = function(e) {
          $log.info("Video occur error.", e);
        };

        videoElement.onwaiting = function(e) {
          $log.info("Video is on waiting");
        };

        videoElement.onratechange = function(e) {
          if ($scope.video) {
            $scope.video.playbackRate = videoElement.playbackRate;
          }
        };

        $scope.$on(VideoEventName.Play, function() {
          $scope.video && $scope.video.play();
        });

        $scope.$on(VideoEventName.Pause, function() {
          $scope.video && $scope.video.pause();
        });

        $scope.$on(VideoEventName.PreviousFrame, function() {
          $scope.video && $scope.video.previousFrame();
        });

        $scope.$on(VideoEventName.NextFrame, function() {
          $scope.video && $scope.video.nextFrame();
        });

        $scope.$on(VideoEventName.ChangeRate, function(event, rate) {
          $scope.video && $scope.video.changeRate(rate);
        });

        $scope.$on(VideoEventName.FastFastForward, function(event) {
          if ($scope.video) {
            $scope.video.changeTime($scope.video.currentTime + FAST_STEP * $scope.video.playbackRate);
          }
        });

        $scope.$on(VideoEventName.FastForward, function(event) {
          if ($scope.video) {
            $scope.video.changeTime($scope.video.currentTime + STEP * $scope.video.playbackRate);
          }
        });

        $scope.$on(VideoEventName.FastBackward, function(event) {
          if ($scope.video) {
            $scope.video.changeTime($scope.video.currentTime - STEP * $scope.video.playbackRate);
          }
        });

        $scope.$on(VideoEventName.FastFastBackward, function(event) {
          if ($scope.video) {
            $scope.video.changeTime($scope.video.currentTime - FAST_STEP * $scope.video.playbackRate);
          }
        });
      }
    };
  }
]);