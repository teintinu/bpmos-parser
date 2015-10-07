'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  parse: function parse(p) {
    if (p.$$arr) {
      return p.$$arr.map(function (l) {
        return l.$$val;
      });
    }
    return p.$$val.split(',').map(function (l) {
      return l.trim();
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=languages.js.map
