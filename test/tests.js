/** globals: expect */

var km = require('../lib/khayyam')
var mdfs = require('mdfs')
import stringify from 'json-stable-stringify'

mdfs.describe(__dirname + '/cases', 'json',
  function (test) {
    return km.parse('khayyam', test['khayyam'])
  },
  function (test, folder) {
    return test ? test.mdfs.title : folder
  },
  function (actual, expected, test) {
    actual = reformat(actual)
    expected = reformat(expected)
    if (actual !== expected) {
      var err = new Error('bad stuff')
      err.expected = expected
      err.actual = actual
      err.showDiff = true
      throw err
    }
  }
)

function reformat (json) {
  try {
    if (typeof json === 'string') json = JSON.parse(json)
    return stringify(json, {space: 2})
  } catch (e) {
    throw new Error('Parsing error: ' + e.message + ' on \n' + json)
  }
}
