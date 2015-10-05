'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.initialize = initialize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _artifacts = require('./artifacts');

var _artifacts2 = _interopRequireDefault(_artifacts);

var _application = require('./application');

var _application2 = _interopRequireDefault(_application);

function initialize() {
  _artifacts2['default'].register('application', _application2['default']);
}
//# sourceMappingURL=types.js.map
