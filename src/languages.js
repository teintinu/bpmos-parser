export default {
  parse: function (p) {
    if (p.$$arr) {
      return p.$$arr.map(function (l) {
        return l.$$val
      })
    }
    return p.$$val.split(',').map(function (l) {
      return l.trim()
    })
  }
}
