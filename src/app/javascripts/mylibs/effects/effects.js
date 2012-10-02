// Generated by CoffeeScript 1.3.3
(function() {

  define(['mylibs/assets/assets', 'libs/face/ccv', 'libs/face/face'], function(assets) {
    var draw, eyeFactor, faces, ghostBuffer, pox, pub, simple, texture, timeStripsBuffer, webgl;
    faces = [];
    eyeFactor = .05;
    timeStripsBuffer = [];
    ghostBuffer = [];
    webgl = fx.canvas();
    pox = new Image();
    pox.src = "images/pox.png";
    texture = null;
    draw = function(canvas, element, effect) {
      var ctx;
      ctx = canvas.getContext("2d");
      webgl.draw(texture);
      effect(webgl, element);
      webgl.update();
      return ctx.drawImage(webgl, 0, 0, webgl.width, webgl.height);
    };
    simple = function(canvas, element, x, y, width, height) {
      var ctx;
      ctx = canvas.getContext("2d");
      return ctx.drawImage(element, x, y, width, height);
    };
    return pub = {
      clearBuffer: function() {
        timeStripsBuffer = [];
        return ghostBuffer = [];
      },
      init: function() {},
      advance: function(element) {
        if (texture != null) {
          return texture.loadContentsOf(element);
        } else {
          return texture = webgl.texture(element);
        }
      },
      data: [
        {
          id: "normal",
          name: "Normal",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas) {
              return canvas;
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "bulge",
          name: "Bulge",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas) {
              return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, .65);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "pinch",
          name: "Pinch",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, -.65);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "swirl",
          name: "Swirl",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.swirl(canvas.width / 2, canvas.height / 2, (canvas.width / 2) / 2, 3);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "dent",
          name: "Dent",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.bulgePinch(canvas.width / 2, canvas.height / 2, canvas.width / 4, -.4);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "zoomBlur",
          name: "Zoom Blur",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.zoomBlur(canvas.width / 2, canvas.height / 2, 2, canvas.height / 5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "blockhead",
          name: "Blockhead",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.blockhead(canvas.width / 2, canvas.height / 2, 200, 300, 1);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "mirrorLeft",
          name: "Mirror Left",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.mirror(0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "mirrorBottom",
          name: "Mirror Bottom",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.mirror(Math.PI * 1.5);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "mirrorTube",
          name: "Mirror Tube",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.mirrorTube(canvas.width / 2, canvas.height / 2, canvas.height / 4);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "quad",
          name: "Quad",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.quadRotate(0, 0, 0, 0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "sepia",
          name: "Sepia",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.sepia(120);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "andy",
          name: "Andy",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function(canvas, element) {
              canvas.quadRotate(0, 0, 0, 0);
              return canvas.popArt();
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "oldFilm",
          name: "Old Film",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function(canvas, element) {
              return canvas.oldFilm(frame);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "frozen",
          name: "Frozen",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.blueberry();
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "ghost",
          name: "Ghost",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function(canvas, element) {
              var createBuffers;
              createBuffers = function(length) {
                var _results;
                _results = [];
                while (ghostBuffer.length < length) {
                  _results.push(ghostBuffer.push(canvas.texture(element)));
                }
                return _results;
              };
              createBuffers(32);
              ghostBuffer[frame++ % ghostBuffer.length].loadContentsOf(element);
              canvas.matrixWarp([1, 0, 0, 1], false, true);
              canvas.blend(ghostBuffer[frame % ghostBuffer.length], .5);
              return canvas.matrixWarp([-1, 0, 0, 1], false, true);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "kaleidoscope",
          name: "Kaleidoscope",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.kaleidoscope(canvas.width / 2, canvas.height / 2, 200, 0);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "inverted",
          name: "Inverted",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.invert();
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "photocopy",
          name: "Photocopy",
          kind: "webgl",
          filter: function(canvas, element, frame) {
            var effect;
            effect = function(canvas, element) {
              return canvas.photocopy(.35, frame);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "colorHalfTone",
          name: "Color Half Tone",
          kind: "webgl",
          filter: function(canvas, element) {
            var effect;
            effect = function(canvas, element) {
              return canvas.colorHalftone(canvas.width / 2, canvas.height / 2, .30, 3);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "frogman",
          name: "Frogman",
          tracks: true,
          filter: function(canvas, element, frame, track) {
            var effect;
            if (track.faces.length !== 0) {
              faces = track.faces;
            }
            effect = function(canvas, element) {
              var eyeWidth, face, factor, height, width, x, y, _i, _len, _results;
              factor = element.width / track.trackWidth;
              _results = [];
              for (_i = 0, _len = faces.length; _i < _len; _i++) {
                face = faces[_i];
                width = face.width * factor;
                height = face.height * factor;
                x = face.x * factor;
                y = face.y * factor;
                eyeWidth = eyeFactor * element.width;
                canvas.bulgePinch((x + width / 2) - eyeWidth, y + height / 3, eyeWidth * 2, .65);
                _results.push(canvas.bulgePinch((x + width / 2) + eyeWidth, y + height / 3, eyeWidth * 2, .65));
              }
              return _results;
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "chubbyBunny",
          name: "Chubby Bunny",
          tracks: true,
          filter: function(canvas, element, frame, stream) {
            var effect;
            if (stream.faces.length !== 0) {
              faces = stream.faces;
            }
            effect = function(canvas, element) {
              var eyeWidth, face, factor, height, width, x, y, _i, _len, _results;
              factor = element.width / stream.trackWidth;
              _results = [];
              for (_i = 0, _len = faces.length; _i < _len; _i++) {
                face = faces[_i];
                width = face.width * factor;
                height = face.height * factor;
                x = face.x * factor;
                y = face.y * factor;
                eyeWidth = eyeFactor * element.width;
                canvas.bulgePinch((x + width / 2) - eyeWidth, (y + height / 3) + eyeWidth, eyeWidth * 2, .65);
                canvas.bulgePinch((x + width / 2) + eyeWidth, (y + height / 3) + eyeWidth, eyeWidth * 2, .65);
                canvas.bulgePinch((x + width / 2) - eyeWidth * 2, (y + height / 3) + eyeWidth * 1.8, eyeWidth * 2.25, .5);
                _results.push(canvas.bulgePinch((x + width / 2) + eyeWidth * 2, (y + height / 3) + eyeWidth * 1.8, eyeWidth * 2.25, .5));
              }
              return _results;
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "giraffe",
          name: "Giraffe",
          tracks: true,
          filter: function(canvas, element, frame, stream) {
            var effect;
            if (stream.faces.length !== 0) {
              faces = stream.faces;
            }
            effect = function(canvas, element) {
              var face, factor, height, width, x, y, _i, _len;
              factor = element.width / stream.trackWidth;
              for (_i = 0, _len = faces.length; _i < _len; _i++) {
                face = faces[_i];
                width = face.width * factor;
                height = face.height * factor;
                x = face.x * factor;
                y = face.y * factor;
              }
              return canvas.blockhead(x, y + height + 25, 1, canvas.height / 2, 1);
            };
            return draw(canvas, element, effect);
          }
        }, {
          id: "eightbits",
          name: "Eight Bits",
          tracks: true,
          filter: function(canvas, element, frame, stream) {
            var effect;
            effect = function(canvas, element) {
              canvas.pixelate(2, 2, 6);
              return canvas.flatColors();
            };
            return draw(canvas, element, effect);
          }
        }
      ]
    };
  });

}).call(this);
