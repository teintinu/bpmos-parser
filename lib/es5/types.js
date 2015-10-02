'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.initialize = initialize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _artifact = require('./artifact');

var _artifact2 = _interopRequireDefault(_artifact);

var _application = require('./application');

var _application2 = _interopRequireDefault(_application);

function initialize() {
  _artifact2['default'].register('application', _application2['default']);
}
//# sourceMappingURL=types.js.map
