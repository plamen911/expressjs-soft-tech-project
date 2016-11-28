/* globals require, module */
'use strict'

const auth = require('../config/auth')
const defines = require('../utilities/defines')
const upload = require('../utilities/upload')
const userMiddleware = require('../utilities/user-middleware')

module.exports = {
  create: (app, config) => {
    return [
      auth.restrictOwner,
      upload(config.avatarsPath, config.imageTypes),
      userMiddleware.create('Owner')
    ]
  },

  save: (app, config) => {
    return [
      (req, res, next) => {
        req.avatarsPath = config.avatarsPath
        next()
      },
      upload(config.avatarsPath, config.imageTypes),
      userMiddleware.save('Owner')
    ]
  },

  edit: (app, config) => {
    return [
      userMiddleware.edit('Owner')
    ]
  },

  add: (app, config) => {
    return [
      auth.restrictOwner,
      userMiddleware.add('Owner')
    ]
  },

  delete: (app, config) => {
    return [
      auth.restrictOwner,
      (req, res, next) => {
        req.avatarsPath = config.avatarsPath
        next()
      },
      userMiddleware.delete('Owner')
    ]
  },

  list: (app, config) => {
    return [
      auth.restrictOwner,
      userMiddleware.list('Owner')
    ]
  }
}

