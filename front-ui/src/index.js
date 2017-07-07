var huoyun = angular.module('huoyun', []);

huoyun.config(["$logProvider", function($logProvider) {
  $logProvider.debugEnabled(true);
}]);

huoyun.controller("appController", ["$scope", "MarkFactory",
  function($scope, MarkFactory) {
    $scope.title = "Test";
    $scope.channels = [{
      name: "channel1",
      src: "file:///Users/i076641/Documents/tmp/left.avi_0.mp4",
      shapes: []
    }, {
      name: "channel2",
      src: "file:///Users/i076641/Documents/tmp/left.avi_0.mp4",
      shapes: []
    }];

    $scope.shapeGroupStore = MarkFactory.newShapeGroupStore();
  }
]);