// Generated by CoffeeScript 1.4.0
(function() {

  define(['Kendo', 'mylibs/tabbing/tabbing'], function(kendo, tabbing) {
    var open, pub, view,
      _this = this;
    view = {};
    this.callback = null;
    open = false;
    return pub = {
      yes: function(e) {
        view.data("kendoMobileModalView").close();
        tabbing.setLevel(0);
        open = false;
        if (_this.callback) {
          return _this.callback();
        }
      },
      no: function(e) {
        open = false;
        view.data("kendoMobileModalView").close();
        return tabbing.setLevel(0);
      },
      init: function(selector) {
        var esc;
        view = $(selector);
        $.subscribe("/confirm/show", function(title, message, callback) {
          _this.callback = callback;
          view.find(".title").html(title);
          view.find(".message").html(message);
          view.find(".yes").text(window.APP.localization.yesButton);
          view.find(".no").text(window.APP.localization.noButton);
          view.data("kendoMobileModalView").open();
          tabbing.setLevel(1);
          return open = true;
        });
        esc = function() {
          if (open) {
            pub.no();
            return false;
          }
        };
        return $.subscribe("/keyboard/esc", esc, true);
      }
    };
  });

}).call(this);
