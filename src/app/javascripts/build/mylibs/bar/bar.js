// Generated by CoffeeScript 1.3.3
(function() {

  define(['text!mylibs/bar/views/bar.html'], function(template) {
    var pub;
    return pub = {
      init: function(selector) {
        var $capture, $container, $content, $counters;
        $container = $(selector);
        $content = $(template);
        $capture = $content.find(".capture");
        $counters = $content.find(".countdown > span");
        $content.on("click", ".capture", function() {
          var countdown;
          $capture.kendoStop(true).kendoAnimate({
            effects: "zoomOut fadeOut",
            duration: 100,
            hide: "true"
          });
          countdown = function(position) {
            return $($counters[position]).kendoStop(true).kendoAnimate({
              effects: "fadeIn",
              duration: 500,
              show: true,
              complete: function() {
                ++position;
                if (position < 3) {
                  return countdown(position);
                } else {
                  console.log("clicky!");
                  return $.publish("/capture/image");
                }
              }
            });
          };
          return countdown(0);
        });
        $content.find(".show-gallery").toggle((function() {
          return $.publish("/gallery/list");
        }), (function() {
          return $.publish("/gallery/hide");
        }));
        $container.append($content);
        $.subscribe("/bar/capture/show", function() {
          return $capture.kendoStop(true).kendoAnimate({
            effects: "slideIn:up",
            show: true,
            duration: 200
          });
        });
        return $.subscribe("/bar/capture/hide", function() {
          return $capture.kendoStop(true).kendoAnimate({
            effects: "slide:down",
            show: true,
            duration: 200
          });
        });
      }
    };
  });

}).call(this);
