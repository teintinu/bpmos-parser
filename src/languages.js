export default {
  parse: function (p) {
    if (p.$$arr) {
      return p.$$arr.map(function (l) {
        l.$$used = true
        return l.$$val
      })
    }
    p.$$used = true
    return p.$$val.split(',').map(function (l) {
      return l.trim()
    })
  }
}
