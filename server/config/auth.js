/* globals module */
'use strict'

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      req.session.returnUrl = req.originalUrl
      res.redirect('/user/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        req.session.returnUrl = req.originalUrl
        res.redirect('/user/login')
      }
    }
  },
  restrictOwner: (req, res, next) => {
    if (req.user.roles.indexOf('Owner') > -1) {
      return res.redirect('/property/list')
    }
    next()
  }
}
