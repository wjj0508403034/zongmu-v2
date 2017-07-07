'use strict';

huoyun.constant("MarkFactory", function() {

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

huoyun.filter("channel", function() {

  return function(shapeGroupStore, channel) {
    if (shapeGroupStore && channel) {
      return shapeGroupStore.findShapesByChannel(channel);
    }

    return [];
  };
});