'use strict';

huoyun.constant("VideoEventName", {
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

huoyun.constant("Video", function($injector, videoElement) {
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

huoyun.filter("FrameInfo", function() {
  return function(video) {
    if (video) {
      return `当前帧：${video.currentFrame} / 总帧数：${video.totalFrames}`;
    }
  };
});

huoyun.filter("TimeInfo", function() {
  return function(video) {
    if (video) {
      return `${video.currentTime.toFixed(2)}:${video.duration.toFixed(2)}`;
    }
  };
});