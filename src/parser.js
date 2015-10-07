import yaml from '../yaml'
import artifacts from './artifacts'
import {initialize} from './types'

import { basename } from 'path'
import { readFileSync } from 'fs'

initialize()

export function parseFile (file) {
  var file_content = readFileSync(file, 'utf-8')
  return parse(file, file_content)
}

export function parse (file, content) {
  var obj = yaml.parse(file, content, function (type, node, loc) {
    if (type === 'value') {
      return {
        $$val: node,
        $$used: undefined,
        $$file: file,
        $$loc: loc.loc
      }
    } else if (type === 'array') {
      return {
        $$arr: node,
        $$used: undefined,
        $$file: file,
        $$loc: loc.loc
      }
    } else {
      node.$$used = undefined
      node.$$file = file
      node.$$loc = loc.loc
      return node
    }
  })
  return parseArtifact(basename(file, '.yaml'), obj)
}

export function parseArtifact (name, obj) {
  var keys = Object.keys(obj)
  var type = keys[0]
  var obj2 = obj[type]
  if (obj2) obj2.$$used = true
  var ret = artifacts.createArtifact(type, name)
  if (!ret) throwAt(obj, 'invalid artifact type ' + type)
  var props = ret.getProperties(type)
  props.forEach(function (prop) {
    var p = parseProperty(prop, obj, obj2)
    if (p !== undefined) ret[prop.name] = p
  })
  checkInvalidProperties(obj)
  return ret
}

function parseProperty (prop, obj, obj2) {
  if (!prop.type) {
    console.dir(prop)
    throwAt(obj, prop.name + ' has no valid type')
  }
  if (obj2 && obj2[prop.name]) obj = obj2
  var p = obj[prop.name]
  if (!p) {
    if (prop.required) throwAt(obj, prop.name + ' is required')
    return undefined
  }
  return prop.type.parse(p)
}

function throwAt (obj, msg) {
  var err = new Error([
    msg, ' at ',
    obj.$$file, ':',
    obj.$$loc.start.line, ':',
    obj.$$loc.start.column].join(''))
  err.file = obj.$$file
  err.loc = obj.$$loc
  throw err
}

function checkInvalidProperties (obj) {
  Object.keys(obj).forEach(function (n) {
    if (/^\$\$/.test(n)) return
    var p = obj[n]
    if (p.$$arr) {
      p.$$arr.forEach(checkInvalidProperties)
    } else {
      if (!p || !p.$$used) throwAt(p, n + ' is not a valid property')
      if (!p.$$val) checkInvalidProperties(p)
    }
  })
}
