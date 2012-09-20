(function() {

  define(['Kendo', 'Glfx', 'mylibs/camera/camera', 'mylibs/bar/bottom', 'mylibs/bar/top', 'mylibs/bar/confirm', 'mylibs/preview/preview', 'mylibs/full/full', 'mylibs/postman/postman', 'mylibs/utils/utils', 'mylibs/gallery/gallery', 'mylibs/gallery/details', 'mylibs/events/events', 'mylibs/file/filewrapper', 'mylibs/settings/settings', 'mylibs/assets/assets', 'libs/record/record'], function(kendo, glfx, camera, bottom, top, confirm, preview, full, postman, utils, gallery, details, events, filewrapper, settings, assets, record) {
    var initAbout, pub;
    initAbout = function(selector) {
      var about, aboutView, oldView;
      about = $(selector);
      aboutView = selector;
      oldView = "#home";
      $.subscribe('/menu/click/chrome-cam-about-menu', function() {
        $.publish("/postman/deliver", [false, "/menu/enable"]);
        oldView = window.APP.app.view().id;
        return window.APP.app.navigate(aboutView);
      });
      about.find("button").click(function() {
        $.publish("/postman/deliver", [true, "/menu/enable"]);
        return window.APP.app.navigate(oldView);
      });
      return about.find("a").click(function() {
        return $.publish("/postman/deliver", [this.getAttribute("href"), "/tab/open"]);
      });
    };
    return pub = {
      init: function() {
        window.APP = {};
        window.APP.full = full;
        window.APP.filters = preview;
        window.APP.gallery = gallery;
        events.init();
        postman.init(window.top);
        assets.init();
        $.subscribe('/camera/unsupported', function() {
          return $('#pictures').append(intro);
        });
        initAbout("#about");
        return camera.init("countdown", function() {
          window.APP.bottom = bottom.init(".bottom");
          window.APP.top = top.init(".top");
          window.APP.confirm = confirm.init("#gallery");
          preview.init("#filters");
          full.init("#capture");
          details.init("#details");
          gallery.init("#thumbnails");
          settings.init("#settings");
          preview.draw();
          $.publish("/postman/deliver", [
            {
              message: ""
            }, "/app/ready"
          ]);
          return window.APP.app = new kendo.mobile.Application(document.body, {
            transition: "overlay:up",
            platform: "blackberry"
          });
        });
      }
    };
  });

}).call(this);
