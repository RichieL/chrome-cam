// Generated by CoffeeScript 1.4.0
(function() {

  define([], function() {
    var link, pub;
    link = null;
    return pub = {
      init: function() {
        link = document.getElementById("opener");
        return $.subscribe("/link/open", function(data) {
          link.href = data.link;
          return link.click();
        });
      }
    };
  });

}).call(this);
