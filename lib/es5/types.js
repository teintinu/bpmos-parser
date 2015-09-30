'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _artifact = require('./artifact');

var _artifact2 = _interopRequireDefault(_artifact);

var app = _artifact2['default'].register('application', {
  properties: [{
    title: {
      type: i18n
    }
  }]
});

var i18n = {};

exports['default'] = app;
module.exports = exports['default'];
//# sourceMappingURL=types.js.map
