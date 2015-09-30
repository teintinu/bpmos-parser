
var artifacts = {
  _: {},
  register: function (type, def) {
    artifacts._[type] = def
    return def
  },
  createArtifact: function (type, name) {
    var def = artifacts._[type]
    if (!def) return
    var r = {
      type,
      getProperties: function(type) {
        return def.properties
      }
    }
    if (name) r.name = name
    return r
  },
}

export default artifacts
