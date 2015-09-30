var YAML = (function () {
  function YAML () {
  }
  YAML.prototype.parse = function (name, yaml, transverse_fn) {
    var error = function error (msg) {
      throw new Error(msg + ' ' + name + ':' + row)
    }
    var readtoken = function readtoken (quote, min_ident, ignore_eol) {
      var trataAspas = function trataAspas (fecha_pipe) {
        var dentro_de_aspas = function dentro_de_aspas () {
          in_ident = false
          tmp.push(c)
          if (ret.loc.start == null) {
            ret.loc.start = {
              line: row,
              column: column
            }
          }
        }
        var fecha_aspas = function fecha_aspas () {
          ret.quote = null
          column++
          return true
        }
        var abre_aspas = function abre_aspas () {
          ret.quoting = true
          ret.quote = c
          in_ident = false
          var tagName = []
          while (idx < yaml.length && c === '|') {
            if (yaml[idx] === '\n') break
            tagName.push(yaml[idx])
            idx++
          }
          ret.tagName = tagName.join('').trim()
        }
        if (fecha_pipe) {
          ret.quoting = false
          idx--
          row--
          return fecha_aspas()
        }
        if (ret.quote == null) {
          abre_aspas()
        } else if (ret.quote === c && c !== '|') {
          return fecha_aspas()
        } else {
          dentro_de_aspas()
        }
      }
      var trataDoisPontos = function trataDoisPontos () {
        if (!ret.quoting && (idx >= yaml.length || (yaml[idx] === ' ' || yaml[idx] === '\n' || yaml[idx] === '\r' || yaml[idx] === '\t'))) {
          ret.tipo = 'object'
          if (yaml[idx] === ' ' || yaml[idx] === '\t') {
            idx++
            column++
          }
          return true
        }
        in_ident = false
        tmp.push(c)
        if (ret.loc.start == null) {
          ret.loc.start = {
            line: row,
            column: column
          }
        }
      }
      var trataHifen = function trataHifen () {
        if (!ret.quoting && (idx >= yaml.length || (yaml[idx] === ' ' || yaml[idx] === '\n' || yaml[idx] === '\r' || yaml[idx] === '\t'))) {
          ret.tipo = 'array'
          last_ident += 2
          if (yaml[idx] === ' ' || yaml[idx] === '\t') {
            idx++
            column++
          }
          if (ret.loc.start == null) {
            ret.loc.start = {
              line: row,
              column: column
            }
          }
          return true
        }
        in_ident = false
        tmp.push(c)
        if (ret.loc.start == null) {
          ret.loc.start = {
            line: row,
            column: column
          }
        }
      }
      var trataBarraN = function trataBarraN () {
        var add_barra_n_ou_espaco = function add_barra_n_ou_espaco () {
          if (!ret.quoting) return
          if (ret.quote === '|') column = 0
          if (quant_n === 1) {
            if (ret.quote === '|') {
              if (ret.row_count > 1) tmp.push('\n')
            } else tmp.push(' ')
          }
          if (c === ' ') in_ident = true
        }
        if (ret.quoting) last_ident = 0
        var quant_n = 0
        while (idx < yaml.length) {
          ret.quebra_de_linha = true
          ret.row_count++
          quant_n++
          c = yaml[idx]
          if (c === '\n' && ret.quoting) tmp.push(c)
          if (c !== '\n') {
            if (yaml[idx - 1] === '\n' && ret.quoting && ret.quote === '|') row++
            add_barra_n_ou_espaco()
            break
          }
          idx++
          column++
          row++
        }
        if (!ret.quoting) {
          new_row = true
          if (ignore_eol && tmp.join('').trim() === '') {
            ignore_eol = false
            tmp = []
          } else {
            return true
          }
        }
      }
      var trataBarraR = function trataBarraR () {
        new_row = true
        if (idx < yaml.length) {
          if (yaml[idx] === '\n') {
            idx++
            column++
          }
        }
        if (ignore_eol && tmp.join('').trim() === '') {
          ignore_eol = false
          tmp = []
        } else {
          return true
        }
      }
      var trataComentario = function trataComentario () {
        idx++
        while (idx < yaml.length) {
          c = yaml[idx]
          if (c === '\r' || c === '\n') {
            var aux_idx = idx
            last_ident = 0
            while (aux_idx < yaml.length) {
              aux_idx++
              c = yaml[aux_idx]
              if (c === ' ') {
                last_ident++
              } else {
                if (last_ident < min_ident) {
                  return true
                } else {
                  idx++
                  new_row = true
                  return false
                }
              }
            }
          }
          idx++
          column++
        }
        if (idx >= yaml.length) {
          return true
        }
      }
      var verifica_token = function verifica_token () {
        if (c === '#' && !ret.quoting) {
          return trataComentario()
        }
        if (c === '\n') {
          if (trataBarraN()) return true
        } else if (c === '\r') {
          if (trataBarraR()) return true
        } else if (in_ident && c === '-' && min_ident >= last_ident) {
          if (trataHifen()) return true
        } else if (c === ':') {
          if (trataDoisPontos()) return true
        } else if (ret.quote !== false && c === '"' || c === "'" || c === '|') {
          if (trataAspas()) return true
        } else {
          if (in_ident) {
            if (c === ' ' || c === '\t') {
              if (ret.quote === '|' && last_ident > min_ident) in_ident = false
              else last_ident++
            } else {
              if (ret.quote !== '|' && last_ident < min_ident && ret.quebra_de_linha && ret.tipo === 'value') {
                idx--
                return true
              }
              in_ident = false
            }
          }
          if (!in_ident) {
            if (ret.quote === '|' && last_ident < min_ident) {
              trataAspas(true)
              while (c !== '\n') {
                idx--
                c = yaml[idx]
              }
              idx++
              new_row = true
              return true
            } else {
              tmp.push(c)
              if (ret.loc.start == null) {
                ret.loc.start = {
                  line: row,
                  column: column
                }
              }
            }
          }
        }
      }
      if (next_token || next_token === undefined) return next_token
      if (idx >= yaml.length) return undefined
      var ret = {
        tagName: undefined,
        str: '',
        tipo: 'value',
        quote: quote,
        quoting: quote != null && quote !== false,
        row_count: 0,
        loc: {
          start: null,
          end: null
        }
      }
      var in_ident = true
      row_tokens++
      var c
      var tmp = []
      while (idx < yaml.length) {
        if (new_row) {
          row++
          column = 0
          last_ident = 0
          row_tokens = 0
          new_row = false
        }
        c = yaml[idx]
        idx++
        if (verifica_token()) break
        column++
      }
      if (ret.quote === '|' && idx >= yaml.length - 1) tmp.push('\n')
      ret.str = tmp.join('')
      ret.ident = last_ident
      ret.loc.end = {
        line: row,
        column: column
      }
      if (ret.loc.start == null) {
        ret.loc.start = {
          line: row,
          column: column
        }
      }
      if (!ret.quoting) ret.str = ret.str.replace(/ +$/, '')
      return ret
    }
    var exec_transverse_fn = function exec_transverse_fn (name, node, token) {
      if (!transverse_fn) return node
      if (token.loc.start == null) token.loc.start = token.loc.end
      if (typeof transverse_fn === 'function') return transverse_fn(name, node, token)
      var f = transverse_fn[name]
      if (!f) f = transverse_fn.default
      if (!f) return node
      return f(name, node, token.loc)
    }
    var read_array_block = function read_array_block (min_ident, token) {
      var arr_ident = token.ident
      var arr = []
      var r = read(last_ident, false, 'array')
      arr.push(r === undefined ? null : r)
      next_token = readtoken(false, min_ident, true)
      while (next_token !== undefined && next_token.tipo === 'array' && next_token.ident === arr_ident) {
        next_token = null
        r = read(last_ident, false)
        arr.push(r === undefined ? null : r)
        next_token = readtoken(false, min_ident, true)
      }
      return exec_transverse_fn('array', arr, token)
    }
    var read_object_block = function read_object_block (min_ident, token) {
      var obj = {}
      var obj_ident = token.ident
      var prop_name = token.str
      var r = read(obj_ident + 1, true)
      obj[prop_name] = r === undefined ? null : r
      next_token = readtoken(false, min_ident, true)
      while (next_token !== undefined && next_token.tipo === 'object' && next_token.ident === obj_ident) {
        prop_name = next_token.str
        next_token = null
        r = read(obj_ident + 1, true)
        obj[prop_name] = r === undefined ? null : r
        next_token = readtoken(false, min_ident, true)
      }
      return exec_transverse_fn('object', obj, token)
    }
    var convert = function convert (str) {
      var v = parseInt(str, 10)
      if (!isNaN(v)) return v
      v = parseFloat(str)
      if (!isNaN(v)) return v
      if (str === 'true') return true
      if (str === 'false') return false
      if (str === '' || str === 'null') return null
      return str
    }
    var read_value = function read_value (min_ident, token) {
      var v = [token.str]
      var fechou_aspas = token.quoting && token.quote == null
      if (!fechou_aspas) {
        var close_quote = token.quoting ? token.quote : false
        next_token = readtoken(close_quote, min_ident)
        var append_space = true
        while (next_token && next_token.tipo === 'value') {
          if (next_token.str === '') {
            v.push('\n')
            append_space = false
          } else {
            if (!(next_token.ident >= min_ident)) break
            if (append_space) v.push(' ')
            v.push(next_token.str)
            append_space = true
          }
          fechou_aspas = next_token.quoting && next_token.quote == null
          next_token = null
          if (!fechou_aspas) next_token = readtoken(close_quote, min_ident)
        }
      }
      if (next_token === null) {
        next_token = readtoken(false, 0)
        while (next_token && next_token.tipo === 'value' && next_token.str === '') {
          next_token = null
          next_token = readtoken(false, 0)
        }
      }
      while (v.length > 0 && v[v.length - 1] === '\n') v.pop()
      v = v.join('')
      if (!token.quoting) v = convert(v)
      if (token.tagName) {
        v = exec_transverse_fn('taggedValue', {
          tag: token.tagName,
          value: v
        }, token)
      }
      else v = exec_transverse_fn('value', v, token)
      if (token.quoting && token.quote != null || token.quote != null) {
        if (token.quote === '|') {
          token.quote = null
          token.quoting = false
        } else error('Existem aspas a serem fechadas')
      }
      if (min_ident > token.ident && token.quoting && token.quebra_de_linha) {
        error('Falta de identamento')
      }
      return v
    }
    var read = function read (min_ident, ignore_eol, from) {
      var r
      var token = readtoken(null, min_ident, ignore_eol)
      if (from === 'array' && token.str === '' && token.tipo === 'value') {
        token = readtoken(null, min_ident, ignore_eol)
        if (token.ident === min_ident) {
          next_token = token
          return null
        }
      }
      if (token === undefined) return undefined
      if (token.tipo === 'object') r = read_object_block(min_ident, token)
      else if (token.tipo === 'array') r = read_array_block(min_ident, token)
      else r = read_value(min_ident, token)
      return r
    }
    var idx = 0
    var last_ident = 0
    var row_tokens = 0
    var new_row = true
    var next_token = null
    var row = 0
    var column
    var r = read(0, true)
    while (idx < yaml.length) {
      var c = yaml[idx]
      if (c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r') {
        if (idx < yaml.length) error('Conte\xFAdo inesperado')
      }
      idx++
    }
    return r
  }
  return YAML
})()
module.exports = new YAML()
