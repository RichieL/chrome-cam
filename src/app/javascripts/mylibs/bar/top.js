(function() {

  define(['Kendo', 'text!mylibs/bar/views/top.html'], function(kendo, template) {
    var pub, viewModel;
    viewModel = kendo.observable({});
    return pub = {
      init: function(container) {
        var bar;
        bar = new kendo.View(container, template);
        bar.render(viewModel);
        $.subscribe("/top/update", function(state) {
          return state.set(topBar, state);
        });
        return bar;
      }
    };
  });

}).call(this);
