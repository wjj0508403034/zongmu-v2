'use strict';

var huoyunWidget = angular.module('huoyun.widget', ['ngDialog', 'ngFileUpload']);
'use strict';

angular.module('huoyun.widget').directive("widgetsFootBar", ["footbar",
  function(footbarProvider) {
    return {
      restrict: "A",
      templateUrl: "footbar/footbar.html",
      replace: true,
      link: function($scope, elem, attrs) {

        $scope.getLinks = function() {
          return footbarProvider.getUsefulLinks();
        };

        $scope.getCopyRight = function() {
          return footbarProvider.getCopyRight();
        };

        $scope.getCompanyName = function() {
          return footbarProvider.getCompanyName();
        };

        $scope.getRecordNo = function() {
          return footbarProvider.getRecordInfo();
        };
      }
    };
  }
]);



angular.module('huoyun.widget').provider("footbar", function() {
  var usefulLinks = [];
  var copyright = null;
  var companyName = null;
  var record = null; // 备案信息

  this.configure = function(options) {
    usefulLinks = options.links || [];
    copyright = options.copyRight;
    companyName = options.companyName;
    record = options.recordNo;
  };

  this.getUsefulLinks = function() {
    return usefulLinks;
  };

  this.getCopyRight = function() {
    return copyright;
  };

  this.getRecordInfo = function() {
    return record;
  };

  this.getCompanyName = function() {
    return companyName;
  };

  this.$get = function() {
    return this;
  };
});
'use strict';

angular.module('huoyun.widget').directive("widgetsNav", ["nav", function(navProvider) {
  return {
    restrict: "A",
    templateUrl: "nav/nav.html",
    replace: true,
    scope: {
      "current": "@"
    },
    link: function($scope, elem, attrs) {
      $scope.getNavItem = function() {
        return navProvider.getItems();
      };
    }
  };
}]);

// angular.module('huoyun.widget').controller("navController", ["$scope", "nav", "page", function($scope, navProvider, pageProvider) {
//   $scope.items = navProvider.getItems() || [];
//   angular.forEach($scope.items, function(item, index) {
//     item.className = item.name === $scope.current ? "active" : "";
//   });

//   $scope.contentWidth = pageProvider.getPageWidth();
// }]);

angular.module('huoyun.widget').provider("nav", function() {
  this.items = [];

  this.setItems = function(items) {
    if (angular.isArray(items)) {
      this.items = items;
    }
  };

  this.getItems = function() {
    return this.items;
  };

  this.$get = function() {
    return this;
  };
});
'use strict';

huoyunWidget.constant("MarkFactory", function() {

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.getValue = function() {
    return [this.x, this.y];
  };

  function Shape(storyboard) {
    this.name = `shape${(new Date()).getTime()}`;
    this.sideCount = 5;
    this.pointArray = new SVG.PointArray();
    this.polyline = storyboard.polyline(this.pointArray).fill('none').stroke({ width: 1 });
    this.finished = false;
    this.type = Shape.Types.POLYLINE;
    this.selected = false;
    this.timelineMap = {};
    this.__startDrawing = false;
    this.channel = null;
  }

  Shape.Types = {
    POLYLINE: "POLYLINE",
    RECT: "RECT",
    Any: "Any"
  };

  Shape.prototype.setBorderColor = function(color) {
    this.polyline.stroke({ color: color });
  };

  Shape.prototype.inBox = function(point) {
    return this.polyline.inside(point.x, point.y);
  };

  Shape.prototype.fill = function(bgColor) {
    this.polyline.fill(bgColor);
  };

  Shape.prototype.select = function() {
    this.selected = true;
    this.polyline.fill("rgba(109, 33, 33, 0.25)").selectize().resize().draggable();
  };

  Shape.prototype.unselect = function() {
    this.selected = false;
    this.polyline.fill("none").selectize(false).resize("stop").draggable(false);
  };

  Shape.prototype.addTimeline = function(timeline) {
    this.timelineMap[timeline.frameIndex] = timeline;
  };

  Shape.prototype.__drawRect = function(startPoint, endPoint) {
    var points = [];
    points.push([startPoint[0], startPoint[1]]);
    points.push([startPoint[0], endPoint[1]]);
    points.push([endPoint[0], endPoint[1]]);
    points.push([endPoint[0], startPoint[1]]);
    points.push([startPoint[0], startPoint[1]]);
    this.polyline.plot(points);
  };

  Shape.prototype.addPoint = function(point) {
    if (this.finished) {
      return;
    }

    if (!this.__startDrawing) {
      this.pointArray.value.splice(0, 1, point.getValue());
      this.__startDrawing = true;
      return;
    }

    if (this.type === Shape.Types.RECT) {
      if (this.pointArray.value.length > 2) {
        return new Error(`Rect shape only accept two points.`);
      }

      this.pointArray.value.push(point.getValue());
      if (this.pointArray.value.length === 2) {
        this.__drawRect(this.pointArray.value[0], this.pointArray.value[1]);
        this.finished = true;
      }

      return;
    }

    if (typeof this.sideCount === "number") {
      if (this.pointArray.value.length > this.sideCount) {
        return new Error(`Shape side count is ${this.sideCount}, can't be add more points.`);
      }

      this.pointArray.value.push(point.getValue());

      if (this.pointArray.value.length === this.sideCount) {
        this.pointArray.value.push(this.pointArray.value[0]);
        this.finished = true;
      }
      this.polyline.plot(this.pointArray);
      return;
    }

    this.pointArray.value.push(point.getValue());
    this.polyline.plot(this.pointArray);
  };

  Shape.prototype.moveTo = function(point) {
    if (!this.__startDrawing || this.finished) {
      return;
    }

    if (this.type === Shape.Types.RECT) {
      this.__drawRect(this.pointArray.value[0], [point.x, point.y]);
      return;
    }

    var pointArray = this.pointArray.clone();
    pointArray.value.push(point.getValue());
    this.polyline.plot(pointArray);
  };

  Shape.prototype.isSmaller = function(shape) {
    var selfShapeBox = this.polyline.rbox();
    var shapeBox = shape.polyline.rbox();
    return selfShapeBox.height * selfShapeBox.width < shapeBox.height * shapeBox.width;
  };

  Shape.prototype.setChannel = function(channel) {
    this.channel = channel;
  };


  function ShapeGroup() {
    this.name = `group${(new Date()).getTime()}`;
    this.shapeMap = {};
    this.current = null;
  }

  ShapeGroup.prototype.add = function(shape) {
    this.shapeMap[shape.name] = shape;
  };

  ShapeGroup.prototype.addCurrent = function(shape) {
    this.add(shape);
    this.current = shape;
  };

  ShapeGroup.prototype.contains = function(shapeName) {
    return Object.keys(this.shapeMap).indexOf(shapeName) !== -1;
  };

  ShapeGroup.prototype.select = function() {
    Object.values(this.shapeMap).forEach(function(shape) {
      shape.select();
    });
  };

  ShapeGroup.prototype.unselect = function() {
    Object.values(this.shapeMap).forEach(function(shape) {
      shape.unselect();
    });
  };

  ShapeGroup.prototype.findShapesByChannel = function(channel) {
    let shapes = [];
    Object.values(this.shapeMap).forEach(function(shape) {
      if (shape.channel === channel) {
        shapes.push(shape);
      }
    });

    return shapes;
  };

  ShapeGroup.prototype.removeByShapeName = function(shapeName) {
    delete this.shapeMap[shapeName];
  };

  ShapeGroup.prototype.isEmpty = function() {
    return Object.keys(this.shapeMap).length === 0;
  };

  function ShapeGroupStore() {
    this.groupMap = {};
    this.current = null;
  }

  ShapeGroupStore.prototype.add = function(group) {
    this.groupMap[group.name] = group;
  };

  ShapeGroupStore.prototype.addCurrent = function(group) {
    this.add(group);
    this.current = group;
  };

  ShapeGroupStore.prototype.findGroupByShapeName = function(shapeName) {
    let groups = Object.values(this.groupMap);
    for (var index = 0; index < groups.length; index++) {
      let group = groups[index];
      if (group.contains(shapeName)) {
        return group;
      }
    }
  };

  ShapeGroupStore.prototype.select = function(shapeName) {
    let group = this.findGroupByShapeName(shapeName);
    if (group) {
      this.current = group;
      group.select();
    } else {
      this.unselect();
    }
  };

  ShapeGroupStore.prototype.unselect = function() {
    Object.values(this.groupMap).forEach(function(group) {
      group.unselect();
    });
  };

  ShapeGroupStore.prototype.findShapesByChannel = function(channel) {
    let shapes = [];
    Object.values(this.groupMap).forEach(function(group) {
      shapes = shapes.concat(group.findShapesByChannel(channel));
    });
    return shapes;
  };

  ShapeGroupStore.prototype.removeByGroupName = function(groupName) {
    delete this.groupMap[groupName];
  };

  ShapeGroupStore.prototype.move = function(shape) {
    if (this.current) {
      let oldGroup = this.findGroupByShapeName(shape.name);
      oldGroup.removeByShapeName(shape.name);
      if (oldGroup.isEmpty()) {
        this.removeByGroupName(oldGroup.name);
      }
      this.current.add(shape);
    }
  };

  ShapeGroupStore.prototype.groups = function() {
    return Object.values(this.groupMap);
  };

  ShapeGroupStore.prototype.getShapesByPoint = function() {

  };

  return {
    newPoint: function(x, y) {
      return new Point(x, y);
    },

    newShape: function(storyboard) {
      return new Shape(storyboard);
    },

    newShapeGroup: function(shape) {
      let group = new ShapeGroup();
      group.add(shape);
      return group;
    },

    newShapeGroupStore: function() {
      return new ShapeGroupStore();
    }
  };
}());

huoyunWidget.filter("channel", function() {

  return function(shapeGroupStore, channel) {
    if (shapeGroupStore && channel) {
      return shapeGroupStore.findShapesByChannel(channel);
    }

    return [];
  };
});
'use strict';

huoyunWidget.constant("MarkObject", function() {
  this.name = `obj${(new Date()).getTime()}`;
  this.channelMap = {};

  this.addShapeInChannel = function(channel, shape) {
    if (!channel.name) {
      channel.name = `channel${(new Date()).getTime()}`;
    }

    if (!this.channelMap[channel.name]) {
      this.channelMap[channel.name] = channel;
    }

    if (!Array.isArray(this.channelMap[channel.name].shapes)) {
      this.channelMap[channel.name].shapes = [];
    }

    this.channelMap[channel.name].shapes.push(shape);
    shape.markObject = this;
    shape.channel = channel;
  };

  this.moveShapeIn = function(shape, successCallback) {
    if (shape) {
      var oldMarkObject = shape.markObject;
      if (oldMarkObject.name !== this.name) {
        var index = shape.channel.shapes.indexOf(shape);
        shape.channel.shapes.splice(index, 1);
        this.addShapeInChannel(shape.channel, shape);
        if (typeof successCallback === "function") {
          successCallback.apply(this, [this, oldMarkObject])
        }
      }
    }
  };

  this.empty = function() {
    var keys = Object.keys(this.channelMap);

    for (var index = 0; index < keys.length; index++) {
      if (this.channelMap[keys[index]].shapes.length > 0) {
        return false;
      }
    }

    return true;
  };

  this.setBorderColor = function(color) {
    Object.keys(this.channelMap).forEach(function(key) {
      this.channelMap[key].shapes.forEach(function(shape) {
        shape.setBorderColor(color);
      });
    }.bind(this));
  };

  this.select = function() {
    Object.keys(this.channelMap).forEach(function(key) {
      this.channelMap[key].shapes.forEach(function(shape) {
        if (!shape.selected) {
          shape.select();
        }
      });
    }.bind(this));
  };

  this.unselect = function() {
    Object.keys(this.channelMap).forEach(function(key) {
      this.channelMap[key].shapes.forEach(function(shape) {
        shape.unselect();
      });
    }.bind(this));
  };
});

// huoyun.constant("ShapeType", {
//   POLYLINE: "POLYLINE",
//   RECT: "RECT"
// });

huoyunWidget.constant("ShapeEventName", {
  CREATE: "Shape.Event.Create",
  DELETE: "Shape.Event.Create"
});

/**
 * http://svgjs.com/elements/
 * 
 * SVG draggable
 * https://github.com/svgdotjs/svg.draggable.js
 * 
 * SVG select
 * https://github.com/svgdotjs/svg.select.js
 * 
 * SVG resize
 * https://github.com/svgdotjs/svg.resize.js
 */
// huoyun.constant("Shape", function(storyboard) {
//   this.sideCount = 5;
//   this.pointArray = new SVG.PointArray();
//   this.polyline = storyboard.polyline(this.pointArray).fill('none').stroke({ width: 1 });
//   this.finished = false;
//   this.type = "POLYLINE";
//   this.selected = false;
//   this.timelineMap = {};
//   var startDrawing = false;
//   var markObject = null;

//   function rect(startPoint, endPoint) {
//     var points = [];
//     points.push([startPoint[0], startPoint[1]]);
//     points.push([startPoint[0], endPoint[1]]);
//     points.push([endPoint[0], endPoint[1]]);
//     points.push([endPoint[0], startPoint[1]]);
//     points.push([startPoint[0], startPoint[1]]);
//     this.polyline.plot(points);
//   }

//   this.setBorderColor = function(color) {
//     this.polyline.stroke({ color: color });
//   };

//   this.inBox = function(point) {
//     return this.polyline.inside(point.x, point.y);
//   };

//   this.fill = function(bgColor) {
//     this.polyline.fill(bgColor);
//   };

//   this.select = function() {
//     this.selected = true;
//     this.polyline.fill("rgba(109, 33, 33, 0.25)").selectize().resize().draggable();
//   };

//   this.unselect = function() {
//     this.selected = false;
//     this.polyline.fill("none").selectize(false).resize("stop").draggable(false);
//   };

//   this.addTimeline = function(timeline) {
//     this.timelineMap[timeline.frameIndex] = timeline;
//   };

//   this.addPoint = function(point) {
//     if (this.finished) {
//       return;
//     }

//     if (!startDrawing) {
//       this.pointArray.value.splice(0, 1, point.getValue());
//       startDrawing = true;
//       return;
//     }

//     if (this.type === "RECT") {
//       if (this.pointArray.value.length > 2) {
//         return new Error(`Rect shape only accept two points.`);
//       }

//       this.pointArray.value.push(point.getValue());
//       if (this.pointArray.value.length === 2) {
//         rect.bind(this)(this.pointArray.value[0], this.pointArray.value[1]);
//         this.finished = true;
//       }

//       return;
//     }

//     if (typeof this.sideCount === "number") {
//       if (this.pointArray.value.length > this.sideCount) {
//         return new Error(`Shape side count is ${this.sideCount}, can't be add more points.`);
//       }

//       this.pointArray.value.push(point.getValue());

//       if (this.pointArray.value.length === this.sideCount) {
//         this.pointArray.value.push(this.pointArray.value[0]);
//         this.finished = true;
//       }
//       this.polyline.plot(this.pointArray);
//       return;
//     }

//     this.pointArray.value.push(point.getValue());
//     this.polyline.plot(this.pointArray);
//   };

//   this.moveTo = function(point) {
//     if (!startDrawing || this.finished) {
//       return;
//     }

//     if (this.type === "RECT") {
//       rect.bind(this)(this.pointArray.value[0], [point.x, point.y]);
//       return;
//     }

//     var pointArray = this.pointArray.clone();
//     pointArray.value.push(point.getValue());
//     this.polyline.plot(pointArray);
//   };

//   this.isSmaller = function(shape) {
//     var selfShapeBox = this.polyline.rbox();
//     var shapeBox = shape.polyline.rbox();
//     return selfShapeBox.height * selfShapeBox.width < shapeBox.height * shapeBox.width;
//   };
// });

huoyunWidget.constant("TimelineStatus", {
  BEGIN: "Begin",
  INPROGRESS: "InProgress",
  END: "End"
});

huoyunWidget.constant("Timeline", function(frameIndex) {
  this.frameIndex = frameIndex;
  this.status = "Begin";
});
'use strict';

huoyunWidget.directive("widgetsSvgStoryBoard", ["$log", "MarkFactory", "Timeline", "ShapeEventName", "$timeout",
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
'use strict';

angular.module('huoyun.widget').directive("widgetsTopBar", ["application", function(applicationProvider) {
  return {
    restrict: "A",
    templateUrl: "topbar/topbar.html",
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.getAppName = function() {
        return applicationProvider.getName();
      };
      $scope.hasLogin = applicationProvider.hasLogin();
      if ($scope.hasLogin) {
        $scope.userName = applicationProvider.getUserName();
      }

      $scope.login = function() {
        if (typeof applicationProvider.loginFunc === "function") {
          applicationProvider.loginFunc();
        }
      };

      $scope.register = function() {
        if (typeof applicationProvider.registerFunc === "function") {
          applicationProvider.registerFunc();
        }
      };

      $scope.logout = function() {
        if (typeof applicationProvider.logoutFunc === "function") {
          applicationProvider.logoutFunc.bind(applicationProvider.getUserService())();
        }
      };
    }
  };
}]);


angular.module('huoyun.widget').provider("application", function() {
  var appName = null;
  var isLogin = false;
  var userName = null;
  var userService = null;

  this.loginFunc = null;
  this.registerFunc = null;
  this.logoutFunc = null;

  // if (Cookies.get("login") === "true") {
  //   isLogin = true;
  //   userName = Cookies.get("username");
  // }

  this.setName = function(name) {
    appName = name;
  };

  this.getName = function() {
    return appName;
  };

  this.setLogin = function(loginResult) {
    // if (loginResult !== true) {
    //   Cookies.remove("username");
    //   Cookies.remove("login");
    //   Cookies.remove("role");
    // } else {
    //   Cookies.set("login", loginResult);
    // }

    // isLogin = loginResult;
  };

  this.hasLogin = function() {
    return isLogin;
  };

  this.setUserName = function(user_name, role) {
    //Cookies.set("username", user_name);
    //Cookies.set("role", role);
    userName = user_name;
  };

  this.getUserName = function() {
    return userName;
  };

  this.setUserService = function(user_service) {
    userService = user_service;
  };

  this.getUserService = function() {
    return userService;
  };

  this.$get = function() {
    return this;
  };
});
'use strict';

huoyunWidget.constant("VideoEventName", {
  Play: "video.play",
  Pause: "video.pause",
  PreviousFrame: "video.previous.frame",
  NextFrame: "video.next.frame",
  FastForward: "video.fast.forward",
  FastFastForward: "video.fast.fast.forward",
  FastBackward: "video.fast.backward",
  FastFastBackward: "video.fast.fast.backward",
  ChangeRate: "video.change.rate",
});

huoyunWidget.constant("Video", function($injector, videoElement) {
  this.src = videoElement.src;
  this.duration = videoElement.duration;
  this.height = videoElement.videoHeight;
  this.width = videoElement.videoWidth;
  this.fps = 15;
  this.playbackRate = videoElement.playbackRate;
  this.defaultPlaybackRate = videoElement.defaultPlaybackRate;
  this.currentTime = videoElement.currentTime;
  this.percentage = 0;
  this.totalFrames = parseInt((this.fps * this.duration).toFixed(0));
  this.currentFrame = 0;
  this.status = "loaded";

  const Timer_Interval = 8;
  var timer = null;

  function startTimer() {
    if (this.status === "play") {
      timer = setInterval(function() {
        $injector.get("$timeout")(function() {
          this.setCurrentTime(videoElement.currentTime);
          $injector.get("$log").info(`Frame Index: ${this.currentFrame }`);
        }.bind(this));
      }.bind(this), Timer_Interval / this.playbackRate);
      return;
    }

    stopTimer();
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  this.setCurrentTime = function(currentTime) {
    this.currentTime = currentTime;
    this.percentage = this.currentTime / this.duration;
    this.currentFrame = parseInt((this.fps * currentTime).toFixed(0));
  };

  this.previousFrame = function() {
    if (this.currentFrame > 0) {
      videoElement.currentTime = (this.currentFrame - 1) * 1.0 / this.fps;
    }
  };

  this.nextFrame = function() {
    if (this.currentFrame < this.totalFrames) {
      videoElement.currentTime = (this.currentFrame + 1) * 1.0 / this.fps;
    }
  };

  this.play = function() {
    videoElement.play();
    this.status = "play";
    startTimer.bind(this)()
  };

  this.pause = function() {
    this.status = "pause";
    videoElement.pause();
    stopTimer.bind(this)();
  };

  this.changeRate = function(rate) {
    videoElement.playbackRate = rate;
  };

  this.changeTime = function(time) {
    if (time < 0) {
      videoElement.currentTime = 0;
      return;
    }

    if (time > this.duration) {
      videoElement.currentTime = this.duration;
    }

    videoElement.currentTime = time;
  };
});

huoyunWidget.filter("FrameInfo", function() {
  return function(video) {
    if (video) {
      return `当前帧：${video.currentFrame} / 总帧数：${video.totalFrames}`;
    }
  };
});

huoyunWidget.filter("TimeInfo", function() {
  return function(video) {
    if (video) {
      return `${video.currentTime.toFixed(2)}:${video.duration.toFixed(2)}`;
    }
  };
});
'use strict';

huoyunWidget.directive("widgetsVideoPlayerControlBar", ["VideoEventName", "MarkObject",
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
'use strict';

/*
 * http://www.w3school.com.cn/tags/html_ref_eventattributes.asp
 *
 */
huoyunWidget.directive("widgetsVideoPlayer", ["$sce", "$log", "$timeout", "VideoEventName", "Video", "$injector", "ShapeEventName", "MarkObject", "MarkFactory",
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
angular.module('huoyun.widget').run(['$templateCache', function($templateCache) {$templateCache.put('footbar/footbar.html','<div class="widgets-foot-bar" id="foot"><ul><li ng-repeat="link in getLinks()"><a ng-href="{{link.href}}" ng-bind="link.text"></a></li></ul><div class="addition-info"><span class="copyright"><i class="fa fa-copyright"></i> <span ng-bind="getCopyRight()"></span></span> <span class="company-name" ng-bind="getCompanyName()"></span> <span class="record" ng-bind="getRecordNo()"></span></div></div>');
$templateCache.put('nav/nav.html','<nav class="widgets-nav"><ul><li ng-repeat="item in getNavItem()" name="{{item.name}}" huoyun-append-class="{{item.className}}" ng-if="item.visibility !== false"><a ng-href="{{item.href}}">{{item.text}}</a></li></ul></nav>');
$templateCache.put('topbar/topbar.html','<div class="widgets-top-bar"><div class="left"><div class="title-container" ng-bind="getAppName()"></div></div><div class="right"><div class="sign-bar" ng-if="!hasLogin"><div class="login" widgets-link-button="" text="\u767B\u5F55" ng-click="login()"></div><div class="register" widgets-link-button="" text="\u6CE8\u518C" ng-click="register()"></div></div><div class="info-bar" ng-if="hasLogin"><div class="user-info">\u6B22\u8FCE<span class="user-name">{{userName}}</span></div><div class="logout" widgets-link-button="" text="\u9000\u51FA" ng-click="logout()"></div></div></div></div>');
$templateCache.put('video/video.player.control.bar.html','<div class="row"><div class="col-md-12"><input type="button" ng-click="onPlayButtonClicked()" value="\u64AD\u653E" ng-if="video.status !== \'play\'"> <input type="button" ng-click="onPauseButtonClicked()" value="\u6682\u505C" ng-if="video.status === \'play\'"> <input type="button" ng-click="onPreviousFrameButtonClicked()" value="\u4E0A\u4E00\u5E27"> <input type="button" ng-click="onNextFrameButtonClicked()" value="\u4E0B\u4E00\u5E27"> <input type="button" ng-click="onFastFastForwardButtonClicked()" value="\u5FEB\u5FEB\u8FDB"> <input type="button" ng-click="onFastForwardButtonClicked()" value="\u5FEB\u8FDB"> <input type="button" ng-click="onFastBackwardButtonClicked()" value="\u5FEB\u9000"> <input type="button" ng-click="onFastFastBackwardButtonClicked()" value="\u5FEB\u5FEB\u9000"> <input type="button" ng-click="onChangeRateButtonClicked(0.5)" value="0.5\u500D\u901F\u7387"> <input type="button" ng-click="onChangeRateButtonClicked(1)" value="\u9ED8\u8BA4\u901F\u7387"> <input type="button" ng-click="onChangeRateButtonClicked(2)" value="2\u500D\u901F\u7387"> <span ng-bind="video | FrameInfo"></span> <span ng-bind="video | TimeInfo"></span></div></div><div class="row"><div class="col-md-6" ng-repeat="channel in channels"><div widgets-video-player="" ng-if="$index === 0" ng-model="shapeGroupStore" channel="channel" loaded="onVideoLoaded(video)" on-video-changed="onVideoChanged(video)"></div><div widgets-video-player="" ng-if="$index !== 0" ng-model="shapeGroupStore" channel="channel"></div></div></div>');
$templateCache.put('video/video.player.html','<div class="row"><div class="col-md-12"><input type="button" ng-click="onNewShapeButtonClicked()" value="\u65B0\u5EFA" ng-if="video.status !== \'play\'"> <input type="button" ng-click="onGroupShapeButtonClicked()" value="\u5408\u5E76" ng-if="video.status !== \'play\'"><select class="form-control" ng-model="shapeGroupStore.current" ng-change="onGroupShapeChanged()" ng-options="group as group.name for group in shapeGroupStore.groups()"></select></div></div><div class="row"><div class="col-md-12"><div class="widgets-video-player" widgets-svg-story-board="" ng-model="shapeGroupStore" frame-index="video.currentFrame" channel="channel" on-shape-create-callback="onShapeCreateCallback(shape)" on-shape-selected-changed="onShapeSelectedChanged(shape)"><video preload="metadata"><source type="video/mp4" ng-src="{{channel.src}}"></video></div></div></div>');}]);