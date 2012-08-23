// Generated by CoffeeScript 1.3.3
(function() {

  define(['mylibs/utils/utils'], function(utils) {
    var FILE_SYSTEM_SIZE, KIBIBYTE, MEBIBYTE, createTestFile, pub;
    KIBIBYTE = 1024;
    MEBIBYTE = KIBIBYTE * 1024;
    FILE_SYSTEM_SIZE = 5 * MEBIBYTE;
    createTestFile = function(fileName) {
      var file;
      return file = {
        fileName: fileName,
        thumbnailUrl: fileName,
        size: 128 * 1024,
        dateTaken: new Date()
      };
    };
    return pub = {
      init: function() {
        var data, i;
        $.subscribe("/pictures/bulk", function(result) {
          return console.log(result);
        });
        $.publish("/postman/deliver", [{}, "/file/read", []]);
        data = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 1; _i <= 20; i = ++_i) {
            _results.push(createTestFile(i));
          }
          return _results;
        })();
        return this.dataSource = new kendo.data.DataSource({
          data: data,
          pageSize: 12
        });
      }
    };
  });

}).call(this);
