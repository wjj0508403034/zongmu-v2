'use strict';

huoyun.directive("widgetsSvgStoryBoard", ["$log", "MarkFactory", "Timeline", "ShapeEventName", "$timeout",
  function($log, MarkFactory, Timeline, ShapeEventName, $timeout) {
    return {
      restrict: "A",
      scope: {
        frameIndex: "=",
        shapeGroupStore: "=ngModel",
        channel: "=",
        onShapeCreateCallback: "&",
        onShapeSelectedChanged: "&"
      },
      link: function($scope, elem, attrs) {
        function getShapes() {
          if ($scope.shapeGroupStore && $scope.channel) {
            return $scope.shapeGroupStore.findShapesByChannel($scope.channel);
          }

          return [];
        }

        $scope.currentShape = null;


        $scope.$watch("frameIndex", function(newValue) {
          console.log(arguments);
        });

        var svgId = `svg${(new Date()).getTime()}`;
        var storyBoardContainer = angular.element("<div class='svg-story-board-container'></div>").attr("id", svgId);
        storyBoardContainer.css("height", "100%").css("width", "100%");
        elem.append(storyBoardContainer);
        var svg = SVG(svgId);
        svg.size("100%", "100%");

        svg.mousedown(function(event) {
          var point = MarkFactory.newPoint(event.offsetX, event.offsetY);
          if ($scope.currentShape && !$scope.currentShape.finished) {
            $scope.currentShape.addPoint(point);
            return;
          }

          selectShape(point);
        });

        svg.mousemove(function(event) {
          if ($scope.currentShape && !$scope.currentShape.finished) {
            $scope.currentShape.moveTo(MarkFactory.newPoint(event.offsetX, event.offsetY));
            return;
          }
        });

        function selectShape(point) {
          $scope.currentShape = getSelectShape(point);
          if (!$scope.currentShape) {
            unselectedAll();
            return;
          }

          $scope.shapeGroupStore.select($scope.currentShape.name);
          $scope.onShapeSelectedChanged({
            shape: $scope.currentShape
          });
        }

        function unselectedAll() {
          $scope.shapeGroupStore.unselect();
          $scope.onShapeSelectedChanged({
            shape: null
          });
        }

        /**
         * 当框被其他框包含时选择较小的框。
         */
        function getSelectShape(point) {
          var inBoxShapes = [];
          getShapes().forEach(function(shape, shapeIndex) {
            if (shape.inBox(point)) {
              inBoxShapes.push(shape);
            }
          });

          if (inBoxShapes.length === 1) {
            return inBoxShapes[0];
          }

          if (inBoxShapes.length > 1) {
            var smallShape = inBoxShapes[0];
            for (var index = 1; index < inBoxShapes.length; index++) {
              if (inBoxShapes[index].isSmaller(smallShape)) {
                return inBoxShapes[index];
              }
            }

            return smallShape;
          }
        }

        $scope.$on(ShapeEventName.CREATE, function() {
          $scope.currentShape = MarkFactory.newShape(svg);
          $scope.currentShape.addTimeline(new Timeline($scope.frameIndex));
          $scope.onShapeCreateCallback({
            shape: $scope.currentShape
          });
        });
      }
    }
  }
]);