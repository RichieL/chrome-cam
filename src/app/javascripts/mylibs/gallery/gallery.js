(function() {

  define(['Kendo', 'mylibs/utils/utils', 'mylibs/file/filewrapper', 'text!mylibs/gallery/views/row.html'], function(kendo, utils, filewrapper, template) {
    var add, animation, at, container, data, destroy, ds, el, flipping, get, index, page, pageSize, pages, pub, selected, total,
      _this = this;
    pageSize = 12;
    ds = {};
    data = [];
    container = {};
    el = {};
    selected = {};
    total = 0;
    index = 0;
    flipping = false;
    pages = {
      previous: {},
      next: {}
    };
    animation = {
      effects: "pageturn:horizontal",
      reverse: false,
      duration: 800
    };
    page = function(direction) {
      if (direction > 0 && _this.ds.page() > 1) {
        animation.reverse = true;
        _this.ds.page(_this.ds.page() - 1);
      }
      if (direction < 0 && _this.ds.page() < _this.ds.totalPages()) {
        animation.reverse = false;
        return _this.ds.page(_this.ds.page() + 1);
      }
    };
    destroy = function() {
      var name;
      name = selected.children(":first").data("file-name");
      return selected.kendoStop(true).kendoAnimate({
        effects: "zoomOut fadOut",
        hide: true,
        complete: function() {
          var _this = this;
          return filewrapper.deleteFile(name).done(function() {
            selected.remove();
            return _this.ds.remove(_this.ds.get(name));
          });
        }
      });
    };
    get = function(name) {
      var match, position;
      match = _this.ds.get(name);
      index = _this.ds.view().indexOf(match);
      position = _this.ds.page() > 1 ? pageSize * (_this.ds.page() - 1) + index : index;
      return {
        length: _this.ds.data().length,
        index: position,
        item: match
      };
    };
    at = function(index) {
      var match, position, target;
      target = Math.ceil((index + 1) / pageSize);
      if (target !== _this.ds.page()) _this.ds.page(target);
      position = target > 1 ? index - pageSize : index;
      match = {
        length: _this.ds.data().length,
        index: index,
        item: _this.ds.view()[position]
      };
      return $.publish("/details/update", [match]);
    };
    add = function(item) {
      return _this.ds.add({
        name: item.name,
        file: item.file,
        type: item.type
      });
    };
    return pub = {
      before: function(e) {
        container.parent().height($(window).height() - 50);
        container.parent().width($(window).width());
        return $.publish("/postman/deliver", [
          {
            paused: true
          }, "/camera/pause"
        ]);
      },
      hide: function(e) {
        return $.publish("/postman/deliver", [
          {
            paused: false
          }, "/camera/pause"
        ]);
      },
      swipe: function(e) {
        return page((e.direction === "right") - (e.direction === "left"));
      },
      init: function(selector) {
        var page1, page2;
        page1 = new kendo.View(selector, null);
        page2 = new kendo.View(selector, null);
        container = page1.container;
        pages.previous = page1.render().addClass("page gallery");
        pages.next = page2.render().addClass("page gallery");
        page1.container.on("dblclick", ".thumbnail", function() {
          var thumb;
          thumb = $(this).children(":first");
          return $.publish("/details/show", [get("" + (thumb.data("file-name")))]);
        });
        page1.container.on("click", ".thumbnail", function() {
          var thumb;
          thumb = $(this).children(":first");
          $.publish("/top/update", ["selected"]);
          page1.find(".thumbnail").removeClass("selected");
          selected = $(this).addClass("selected");
          return $.publish("/item/selected", [get("" + (thumb.data("file-name")))]);
        });
        $.subscribe("/pictures/bulk", function(message) {
          _this.ds = new kendo.data.DataSource({
            data: message.message,
            pageSize: 12,
            change: function() {
              var item, thumbnail, _i, _len, _ref,
                _this = this;
              _ref = this.view();
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                thumbnail = new kendo.View(pages.next, template, item);
                thumbnail.render();
              }
              return container.kendoAnimate({
                effects: animation.effects,
                face: animation.reverse ? pages.next : pages.previous,
                back: animation.reverse ? pages.previous : pages.next,
                duration: animation.duration,
                reverse: animation.reverse,
                complete: function() {
                  var justPaged;
                  justPaged = pages.previous;
                  pages.previous = pages.next;
                  pages.next = justPaged;
                  justPaged.empty();
                  return flipping = false;
                }
              });
            },
            sort: {
              dir: "desc",
              field: "name"
            }
          });
          return _this.ds.read();
        });
        $.subscribe("/gallery/delete", function() {
          return destroy();
        });
        $.subscribe("/gallery/add", function(item) {
          return add(item);
        });
        $.subscribe("/gallery/at", function(index) {
          return at(index);
        });
        $.publish("/postman/deliver", [{}, "/file/read"]);
        return gallery;
      }
    };
  });

}).call(this);
