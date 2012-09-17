// Generated by CoffeeScript 1.3.3
(function() {

  define(['mylibs/postman/postman', 'mylibs/utils/utils', 'mylibs/file/file', 'mylibs/intents/intents', 'mylibs/notify/notify', 'mylibs/assets/assets', 'libs/face/track'], function(postman, utils, file, intents, notify, assets, face) {
    'use strict';

    var canvas, ctx, draw, errback, hollaback, iframe, paused, pub, skip, skipBit, skipMax, track, update;
    iframe = iframe = document.getElementById("iframe");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    track = {};
    paused = false;
    skip = false;
    skipBit = 0;
    skipMax = 10;
    draw = function() {
      return update();
    };
    update = function() {
      var buffer, img;
      if (!paused) {
        if (skipBit === 0) {
          track = face.track(video);
        }
        ctx.drawImage(video, 0, 0, video.width, video.height);
        img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        buffer = img.data.buffer;
        $.publish("/postman/deliver", [
          {
            image: img.data.buffer,
            track: track
          }, "/camera/update", [buffer]
        ]);
        if (skipBit < 4) {
          skipBit++;
        } else {
          skipBit = 0;
        }
      }
      return setTimeout(update, 1000 / 30);
    };
    hollaback = function(stream) {
      var e, video;
      e = window.URL || window.webkitURL;
      video = document.getElementById("video");
      video.src = e ? e.createObjectURL(stream) : stream;
      video.play();
      return draw();
    };
    errback = function() {
      return console.log("Couldn't Get The Video");
    };
    return pub = {
      init: function() {
        var thumbnailWorker;
        utils.init();
        $.subscribe("/camera/pause", function(message) {
          return paused = message.paused;
        });
        navigator.webkitGetUserMedia({
          video: true
        }, hollaback, errback);
        iframe.src = "app/index.html";
        postman.init(iframe.contentWindow);
        console.log("Creating worker...");
        thumbnailWorker = new Worker("chrome/javascripts/mylibs/workers/bitmapWorker.js");
        thumbnailWorker.onmessage = function(e) {
          console.log("Sending a thumbnail update...");
          return $.publish("/postman/deliver", [e.data, "/preview/thumbnail/response/"]);
        };
        $.subscribe("/preview/thumbnail/request", function(e) {
          console.log("Requested a thumbnail update...");
          return thumbnailWorker.postMessage({
            width: e.data.width,
            height: e.data.height,
            data: e.data.data,
            key: e.data.key
          });
        });
        notify.init();
        intents.init();
        file.init();
        return face.init(0, 0, 0, 0);
      }
    };
  });

}).call(this);
