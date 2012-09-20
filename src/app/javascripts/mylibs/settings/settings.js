// Generated by CoffeeScript 1.3.3
(function() {

  define(['Kendo', 'text!mylibs/settings/views/settings.html'], function(kendo, template) {
    var pub, show, view, viewModel;
    view = null;
    viewModel = {};
    show = function() {
      return view.container.kendoStop(true).kendoAnimate({
        effects: "zoomIn",
        show: true
      });
    };
    return pub = {
      init: function(selector) {
        view = new kendo.View(selector, template);
        view.render(viewModel, true);
        return $.subscribe('/menu/click/chrome-cam-settings-menu', show);
      }
    };
  });

}).call(this);
