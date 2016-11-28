/* globals require, module */
'use strict'

let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

module.exports = {
  register: (req, res) => {
    res.render('user/register')
  },

  create: (req, res) => {
    let user = req.body

    if (!user.password) {
      user.globalError = 'Password is required'
      return res.render('user/register', user)
    }
    if (user.password !== user.confirmPassword) {
      user.globalError = 'Passwords no not match!'
      return res.render('user/register', user)
    }
    if (!user.firstName) {
      user.globalError = 'First Name is required'
      return res.render('user/register', user)
    }
    if (!user.lastName) {
      user.globalError = 'Last Name is required'
      return res.render('user/register', user)
    }
    else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)
      user.roles = ['Owner']

      User
                .create(user)
                .then(user => {
                  req
                        .logIn(user, (err, user) => {
                          if (err) {
                            user.globalError = err
                            return res.render('user/register', user)
                          }

                          res.redirect('/')
                        })
                })
                .catch((err) => {
                  user.globalError = 'Signup error: ' + err.message
                  res.render('user/register', user)
                })
    }
  },

  login: (req, res) => {
    res.render('user/login')
  },

  authenticate: (req, res) => {
    let reqUser = req.body

    User
            .findOne({username: reqUser.username})
            .then((user) => {
              if (!user || !user.authenticate(reqUser.password)) {
                res.render('user/login', {
                  globalError: 'Invalid username or password',
                  username: reqUser.username || ''
                })
              } else {
                req.logIn(user, (err, user) => {
                  if (err) {
                    return res.render('user/login', {
                      globalError: 'Login error',
                      username: reqUser.username || ''
                    })
                  }

                  let returnUrl = '/'
                  if (req.session.returnUrl) {
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl
                  }
                  res.redirect(returnUrl);
                })
              }
            })
            .catch((err) => {
              res.render('user/login', {globalError: err})
            })
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
