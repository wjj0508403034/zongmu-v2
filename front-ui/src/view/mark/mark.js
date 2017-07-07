'use strict';

huoyun.constant("MarkObject", function() {
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

huoyun.constant("ShapeEventName", {
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

huoyun.constant("TimelineStatus", {
  BEGIN: "Begin",
  INPROGRESS: "InProgress",
  END: "End"
});

huoyun.constant("Timeline", function(frameIndex) {
  this.frameIndex = frameIndex;
  this.status = "Begin";
});