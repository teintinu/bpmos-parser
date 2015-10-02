import yaml from '../yaml'
import artifact from './artifact'
import types from './types'

import { basename } from 'path'
import { readFileSync } from 'fs'

types.initialize()

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
  var ret = artifact.createArtifact(type, name)
  if (!ret) throwAt(obj, 'invalid artifact type ' + type)
  var props = artifact.getProperties(type)
  props.forEach(function (prop) {
    var p = parseProperty(prop, obj, obj2)
    if (p !== undefined) ret[prop] = p
  })
  return ret
}

function parseProperty (prop, obj, obj2) {
  if (obj2[prop.name]) obj = obj2
  if (!obj[prop.name]) {
    if (prop.required) throwAt(obj, prop.name + ' is required')
    return undefined
  }
}

function throwAt (obj, msg) {
  console.dir(obj)
  console.dir(msg)
  var err = new Error([
    msg, ' at ',
    obj.$$file, ':',
    obj.$$loc.start.line, ':',
    obj.$$loc.start.column].join(''))
  err.file = obj.$$file
  err.loc = obj.$$loc
  throw err
}
