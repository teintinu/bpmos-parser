'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  parse: function parse(p) {
    var ret = { 'type': 'messages', messages: [] };
    Object.keys(p).forEach(function (m) {
      if (!/^\$\$/.test(m)) {
        ret.messages.push({
          'type': 'message',
          'language': m,
          'message': p[m].$$val
        });
        p[m].$$used = true;
      }
    });
    p.$$used = true;
    return ret;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=i18n.js.map
