// Generated by CoffeeScript 1.3.3
(function() {

  kendo.data.binders.zoom = kendo.data.Binder.extend({
    refresh: function() {
      var value, visible;
      value = this.bindings["zoom"].get();
      visible = $(this.element).is(":visible");
      if (value) {
        if (!visible) {
          $(this.element).kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true
          });
        }
      }
      if (!value && visible) {
        return $(this.element).kendoStop(true).kendoAnimate({
          effects: "zoomOut fadeOut",
          show: true
        });
      }
    }
  });

  kendo.data.binders.localeText = kendo.data.Binder.extend({
    refresh: function() {
      var text;
      text = APP.localization[this.bindings.localeText.path];
      if (text == null) {
        console.log("Missing localization for " + this.bindings.localeText.path + ", is it in localization.coffee?");
      }
      return $(this.element).text(text);
    }
  });

  kendo.data.binders.localeHtml = kendo.data.Binder.extend({
    refresh: function() {
      var html;
      html = APP.localization[this.bindings.localeHtml.path];
      if (html == null) {
        console.log("Missing localization for " + this.bindings.localeHtml.path + ", is it in localization.coffee?");
      }
      return $(this.element).html(html);
    }
  });

  kendo.data.binders.localeTitle = kendo.data.Binder.extend({
    refresh: function() {
      var title;
      title = APP.localization[this.bindings.localeTitle.path];
      if (title == null) {
        console.log("Missing localization for " + this.bindings.localeTitle.path + ", is it in localization.coffee?");
      }
      return $(this.element).attr("title", title);
    }
  });

}).call(this);
