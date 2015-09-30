'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _artifacts = require('./artifacts');

var _artifacts2 = _interopRequireDefault(_artifacts);

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var app = _artifacts2['default'].register('application', {
  properties: [{
    name: 'title',
    type: _i18n2['default']
  }]
});

exports['default'] = app;
module.exports = exports['default'];
//# sourceMappingURL=application.js.map
