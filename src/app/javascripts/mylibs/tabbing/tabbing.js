// Generated by CoffeeScript 1.4.0
(function() {

  define(['mylibs/utils/utils'], function(utils) {
    var kill, pub;
    kill = function() {
      return $("[data-tabbable]").removeAttr("tabindex");
    };
    return pub = {
      init: function() {
        return $(document.body).on("keydown", "*[data-tabbable]", function(e) {
          var target;
          if (!(e.which === utils.keys.space || e.which === utils.keys.enter)) {
            return;
          }
          target = $(e.target);
          if (target.data("role") === "button") {
            return target.data("kendoMobileButton").trigger("click", e);
          } else if (target.data("role") === "clickable") {
            return target.data("kendoMobileClickable").trigger("click", e);
          } else {
            return target.trigger("click", e);
          }
        });
      },
      setup: function(view) {
        kill();
        console.log(view);
        window.deviltry = view;
        return setTimeout((function() {
          return console.log($("[data-tabbable]", $(view)).attr("tabindex", 1));
        }), 2000);
      }
    };
  });

}).call(this);