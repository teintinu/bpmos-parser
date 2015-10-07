
export default {
  parse: function (p, {loc}) {
    var ret = {'type': 'messages', messages: []}
    Object.keys(p).forEach(function (m) {
      if (!/^\$\$/.test(m)) {
        ret.messages.push({
          'type': 'message',
          'language': m,
          'message': p[m].$$val,
          'loc': loc(p[m])
        })
        p[m].$$used = true
      }
    })
    p.$$used = true
    return ret
  }
}
