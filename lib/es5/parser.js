'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parseFile = parseFile;
exports.parse = parse;
exports.parseArtifact = parseArtifact;
exports.loc = loc;

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
  if (obj2) obj2.$$used = true;
  var ret = _artifacts2['default'].createArtifact(type, name);
  if (!ret) throwAt(obj, 'invalid artifact type ' + type);
  var props = ret.getProperties(type);
  props.forEach(function (prop) {
    var p = parseProperty(prop, obj, obj2);
    if (p !== undefined) ret[prop.name] = p;
  });
  checkInvalidProperties(obj);
  ret.loc = loc(obj);
  return ret;
}

function loc(obj) {
  return {
    file: obj.$$file,
    start: obj.$$loc.start,
    end: obj.$$loc.end
  };
}

function parseProperty(prop, obj, obj2) {
  if (!prop.type) {
    throwAt(obj, prop.name + ' has no valid type');
  }
  if (obj2 && obj2[prop.name]) obj = obj2;
  var p = obj[prop.name];
  if (!p) {
    if (prop.required) throwAt(obj, prop.name + ' is required');
    return undefined;
  }
  var pr = prop.type.parse(p, { loc: loc });
  pr.loc = loc(p);
  return pr;
}

function throwAt(obj, msg) {
  var err = new Error([msg, ' at ', obj.$$file, ':', obj.$$loc.start.line, ':', obj.$$loc.start.column].join(''));
  err.file = obj.$$file;
  err.loc = obj.$$loc;
  throw err;
}

function checkInvalidProperties(obj) {
  Object.keys(obj).forEach(function (n) {
    if (/^\$\$/.test(n)) return;
    var p = obj[n];
    if (p.$$arr) {
      p.$$arr.forEach(checkInvalidProperties);
    } else {
      if (!p || !p.$$used) throwAt(p, n + ' is not a valid property');
      if (!p.$$val) checkInvalidProperties(p);
    }
  });
}
//# sourceMappingURL=parser.js.map
