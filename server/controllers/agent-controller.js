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
      userMiddleware.create('Agent')
    ]
  },

  save: (app, config) => {
    return [
      auth.restrictOwner,
      (req, res, next) => {
        req.avatarsPath = config.avatarsPath
        next()
      },
      upload(config.avatarsPath, config.imageTypes),
      userMiddleware.save('Agent')
    ]
  },

  edit: (app, config) => {
    return [
      auth.restrictOwner,
      userMiddleware.edit('Agent')
    ]
  },

  add: (app, config) => {
    return [
      auth.restrictOwner,
      userMiddleware.add('Agent')
    ]
  },

  delete: (app, config) => {
    return [
      auth.restrictOwner,
      (req, res, next) => {
        req.avatarsPath = config.avatarsPath
        next()
      },
      userMiddleware.delete('Agent')
    ]
  },

  list: (app, config) => {
    return [
      auth.restrictOwner,
      userMiddleware.list('Agent')
    ]
  }
}
