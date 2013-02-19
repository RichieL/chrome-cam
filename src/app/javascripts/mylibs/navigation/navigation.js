// Generated by CoffeeScript 1.4.0
(function() {

  define([], function() {
    "use strict";

    var callbacks, pub;
    callbacks = {
      to: {},
      from: {}
    };
    return pub = {
      navigate: function(view) {
        var callback, deferreds, previous, _i, _j, _len, _len1, _ref, _ref1;
        deferreds = [];
        previous = window.APP.app.view().id;
        if (previous in callbacks.from) {
          _ref = callbacks.from[previous];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            deferreds.push(callback());
          }
        }
        if (view in callbacks.to) {
          _ref1 = callbacks.to[view];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            callback = _ref1[_j];
            deferreds.push(callback());
          }
        }
        return $.when.apply($, deferreds).done(function() {
          return window.APP.app.navigate(view);
        });
      },
      navigating: {
        to: function(view, callback) {
          if (!(view in callbacks.to)) {
            callbacks.to[view] = [];
          }
          return callbacks.to[view].push(callback);
        },
        from: function(view, callback) {
          if (!(view in callbacks.from)) {
            callbacks.from[view] = [];
          }
          return callbacks.from[view].push(callback);
        }
      }
    };
  });

}).call(this);
