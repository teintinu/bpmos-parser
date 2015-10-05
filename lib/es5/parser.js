'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parseFile = parseFile;
exports.parse = parse;
exports.parseArtifact = parseArtifact;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _yaml = require('../yaml');

var _yaml2 = _interopRequireDefault(_yaml);

var _artifacts = require('./artifacts');

var _artifacts2 = _interopRequireDefault(_artifacts);

var _types = require('./types');

var _path = require('path');

var _fs = require('fs');

(0, _types.initialize)();

function parseFile(file) {
  var file_content = (0, _fs.readFileSync)(file, 'utf-8');
  return parse(file, file_content);
}

function parse(file, content) {
  var obj = _yaml2['default'].parse(file, content, function (type, node, loc) {
    if (type === 'value') {
      return {
        $$val: node,
        $$used: undefined,
        $$file: file,
        $$loc: loc.loc
      };
    } else if (type === 'array') {
      return {
        $$arr: node,
        $$used: undefined,
        $$file: file,
        $$loc: loc.loc
      };
    } else {
      node.$$used = undefined;
      node.$$file = file;
      node.$$loc = loc.loc;
      return node;
    }
  });
  return parseArtifact((0, _path.basename)(file, '.yaml'), obj);
}

function parseArtifact(name, obj) {
  var keys = Object.keys(obj);
  var type = keys[0];
  var obj2 = obj[type];
  var ret = _artifacts2['default'].createArtifact(type, name);
  if (!ret) throwAt(obj, 'invalid artifact type ' + type);
  var props = ret.getProperties(type);
  props.forEach(function (prop) {
    var p = parseProperty(prop, obj, obj2);
    if (p !== undefined) ret[prop.name] = p;
  });
  return ret;
}

function parseProperty(prop, obj, obj2) {
  if (obj2 && obj2[prop.name]) obj = obj2;
  var p = obj[prop.name];
  if (!p) {
    if (prop.required) throwAt(obj, prop.name + ' is required');
    return undefined;
  }
  return prop.type.parse(p);
}

function throwAt(obj, msg) {
  var err = new Error([msg, ' at ', obj.$$file, ':', obj.$$loc.start.line, ':', obj.$$loc.start.column].join(''));
  err.file = obj.$$file;
  err.loc = obj.$$loc;
  throw err;
}
//# sourceMappingURL=parser.js.map
