/* globals require, module */
'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const busboy = require('connect-busboy')

module.exports = (app, config) => {
  app.set('view engine', 'ejs')
  app.set('views', config.rootPath + 'server/views')

  app.use(cookieParser())
  app.use(busboy())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: config.sessionSecter,
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    req.getUrl = () => {
      return req.protocol + '://' + req.get('host') + req.originalUrl
    }
    return next()
  })
  app.use((req, res, next) => {
    if (req.user) {
      let pageController = ''
      if (req.user.roles.indexOf('Owner') !== -1) {
        pageController = 'owner'
      } else {
        pageController = 'agent'
      }

      res.locals.currentUser = req.user
      res.locals.pageController = pageController
    }
    next()
  })
  app.use(express.static(config.rootPath + 'public'))

  console.log('Express ready!')
}
