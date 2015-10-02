'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var artifacts = {
  _: {},
  register: function register(type, def) {
    console.log('artifacts.register ' + type);
    artifacts._[type] = def;
    return def;
  },
  createArtifact: function createArtifact(type, name) {
    var def = artifacts._[type];
    if (!def) {
      console.log('artifacts.createArtifact - no def');
      return;
    }
    var r = {
      type: type,
      getProperties: function getProperties(type) {
        return def.properties;
      }
    };
    if (name) r.name = name;
    return r;
  }
};

exports['default'] = artifacts;
module.exports = exports['default'];
//# sourceMappingURL=artifact.js.map
