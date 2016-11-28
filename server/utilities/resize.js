/* globals require, module */
'use strict'

const gm = require('gm').subClass({imageMagick: true})
const async = require('async')
const path = require('path')

const sizes = {
  small: 480,
  medium: 800
}

module.exports = function (filepath, filename, callback) {
  let parts = filename.split('.')
  let extension = parts.pop()
  let name = parts.join('.')
  let tasks = []

  for (let key in sizes) {
    ((key, sizes) => {
      tasks.push((callback) => {
        // let from = filepath + '/' + filename
        let resizeName = name + '_' + key + '.' + extension
        resize(filepath, filename, resizeName, sizes[key], callback)
      })
    })(key, sizes)
  }

  async.parallel(tasks, callback)
}

function resize (filepath, filename, resizeName, size, callback) {
  let from = path.join(filepath, filename)
  let to = path.join(filepath, resizeName)
  gm(from).resize(size).write(to, (err) => {
    callback(err, resizeName)
  })
}
