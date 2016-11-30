/* globals require, module */
'use strict'

const fs = require('fs')
const _ = require('underscore')

const encryption = require('../utilities/encryption')
const defines = require('../utilities/defines')
const pagination = require('../utilities/pagination')

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

module.exports = {
  create: (role) => {
    return (req, res, next) => {
      let pageTitle = getPageTitle(role)
      let action = role.toLowerCase()
      let data = _.extend(getPostedData(req), {
        role: role,
        pageTitle: pageTitle,
        formTitle: pageTitle,
        formAction: '/' + action + '/add/',
        newUser: 1,
        userListUrl: req.session[action + 'ListUrl'] || '/' + action + '/list'
      })

      // form validation
      if (!data.firstName) {
        data.globalError = 'First Name is required'
        return res.render('user/form', data)
      }
      if (!data.lastName) {
        data.globalError = 'Last Name is required'
        return res.render('user/form', data)
      }
      if (!data.emails.length || !data.emails[0]) {
        data.globalError = 'E-mail is required'
        return res.render('user/form', data)
      }
      if (!data.username) {
        data.globalError = 'Username is required'
        return res.render('user/form', data)
      }
      if (!req.body.password) {
        data.globalError = 'Password is required'
        return res.render('user/form', data)
      }
      if (req.body.password !== req.body.confirmPassword) {
        data.globalError = 'Passwords do not match!'
        return res.render('user/form', data)
      } else {
        data.salt = encryption.generateSalt()
        data.hashedPass = encryption.generateHashedPassword(data.salt, req.body.password)
      }

      data.roles = [role]

      new User(data)
                .save()
                .then((user) => {
                  req.session.globalSuccess = role + ' successfully added.'
                  res.redirect('/' + action + '/edit/' + user._id)
                })
                .catch((err) => {
                  data.globalError = 'Error saving new ' + role.toLowerCase() + '. ' + err.message
                  res.render('user/form', data)
                })
    }
  },

  save: (role) => {
    return (req, res, next) => {
      let pageTitle = getPageTitle(role)
      let action = role.toLowerCase()
      let _id = req.params.id || 0
      let data = _.extend(getPostedData(req), {
        role: role,
        pageTitle: pageTitle,
        formTitle: pageTitle,
        formAction: '/' + action + '/edit/' + _id,
        userListUrl: req.session[action + 'ListUrl'] || '/' + action + '/list'
      })
      let deleteOldFile = false

            // form validation
      if (!data.firstName) {
        data.globalError = 'First Name is required'
        return res.render('user/form', data)
      }
      if (!data.lastName) {
        data.globalError = 'Last Name is required'
        return res.render('user/form', data)
      }

            // password change logic
      if (req.body.password) {
        if (req.body.password !== req.body.confirmPassword) {
          data.globalError = 'Passwords do not match!'
          return res.render('user/form', data)
        } else {
          data.salt = encryption.generateSalt()
          data.hashedPass = encryption.generateHashedPassword(data.salt, req.body.password)
        }
      }

      if (req.files && req.files['avatar']) {
        if (!req.files['avatar'].uploadErrors.length) {
          deleteOldFile = true
          data.avatar = req.files['avatar'].fileName
        } else {
          let errors = []
          req.files['avatar'].uploadErrors.forEach((error) => {
            errors.push(error)
          })
          data.globalError = errors.join('; ')
          return res.render('user/form', data)
        }
      }

      if (typeof data.username !== 'undefined') {
        delete data.username
      }

      User
                .findOne({_id: _id})
                .then((user) => {
                    // housekeeping
                  if (typeof user.avatar !== 'undefined' && user.avatar && deleteOldFile) {
                    try {
                      fs.unlinkSync(req.avatarsPath + user.avatar)
                    } catch (err) {
                      console.log(`Error deleting old avatar1: ${err.message}`)
                    }
                  }
                  user = _.extend(user, data)
                  user
                        .save()
                        .then((user) => {
                          req.session.globalSuccess = 'Update Successful.'
                          res.redirect('/' + action + '/edit/' + user._id)
                        })
                        .catch((err) => {
                          res.render('error', {
                            pageTitle: pageTitle,
                            message: 'Error updating ' + role.toLowerCase() + '.',
                            error: err
                          })
                        })
                })
                .catch((err) => {
                  res.render('error', {
                    pageTitle: pageTitle,
                    message: 'Error selecting ' + role.toLowerCase() + '.',
                    error: err
                  })
                })
    }
  },

  edit: (role) => {
    return (req, res, next) => {
      let pageTitle = getPageTitle(role)
      let action = role.toLowerCase()
      let _id = req.params.id || 0

      if (_id + '' === req.user._id + '') {
        pageTitle = 'My Profile'
      }

      User
                .findOne({_id: _id})
                .populate('properties')
                .then((user) => {
                  let data = {
                    role: role,
                    pageTitle: pageTitle,
                    formTitle: pageTitle,
                    formAction: '/' + action + '/edit/' + user._id,
                    userListUrl: req.session[action + 'ListUrl'] || '/' + action + '/list'
                  }
                  data = _.extend(getPostedData(req), data)
                  data = _.extend(data, user)
                  if (req.session.globalSuccess) {
                    data.globalSuccess = req.session.globalSuccess
                    delete req.session.globalSuccess
                  }
                  if (data.avatar) {
                    data.avatar = defines.getImgWithSuffix(data.avatar, 'small')
                  }
                  res.render('user/form', data)
                })
                .catch((err) => {
                  res.render('error', {
                    pageTitle: pageTitle,
                    message: 'Error selecting ' + role.toLowerCase() + '.',
                    error: err
                  })
                })
    }
  },

  add: (role) => {
    return (req, res, next) => {
      let pageTitle = getPageTitle(role)
      let action = role.toLowerCase()

      let data = {
        role: role,
        pageTitle: pageTitle,
        formTitle: 'Add New ' + role,
        formAction: '/' + action + '/add',
        newUser: 1,
        userListUrl: req.session[action + 'ListUrl'] || '/' + action + '/list'
      }
      data = _.extend(getPostedData(req), data)
      res.render('user/form', data)
    }
  },

  list: (role) => {
    return (req, res, next) => {
      let pageTitle
      let action
      let roles
      if (role === 'Owner') {
        roles = ['Owner']
        pageTitle = 'Owner List'
        action = 'owner'
      } else {
        roles = ['Admin', 'Agent']
        pageTitle = 'Agent List'
        action = 'agent'
      }

      req.session[action + 'ListUrl'] = req.originalUrl

      let firstName = req.params.firstName || null
      let lastName = req.params.lastName || null
      let email = req.params.email || null
      let pageSize = (req.query.limit && parseInt(req.query.limit, 10)) || 10

        let data = {
            role: role,
            pageTitle: pageTitle,
            rows: [],
            pagination: {},
            action: action
        }

            // db.getCollection('users').find( { roles: { $in: ['Admin', 'Owner'] } } )
      let query = {
        roles: {
          $in: roles
        }
      }
      if (firstName) {
        query.firstName = firstName
      }
      if (lastName) {
        query.lastName = lastName
      }
      if (email) {
        query.emails = email
      }

        let options = {
            sort: { firstName: 1, lastName: 1, createdAt: -1 },
            lean: true,
            page: req.query.page || 1,
            limit: pageSize
        }

        User
            .paginate(query, options)
            .then(result => {
                data.rows = result.docs
                data.pagination = pagination(req, result)
                res.render('user/list', data)
            })
            .catch(err => {
                res.render('error', {
                    pageTitle: pageTitle,
                    message: 'Error selecting ' + pageTitle.toLowerCase() + '.',
                    error: err
                })
            })
    }
  },

  delete: (role) => {
    return (req, res, next) => {
      let pageTitle = getPageTitle(role)
      let action = role.toLowerCase()
      let _id = req.params.id || 0

      let field
      if (role === 'Owner') {
        field = '_owner'
      } else {
        field = '_agent'
      }

      User
                .findOne({_id: _id})
                .then((user) => {
                  if (user.avatar) {
                    try {
                      fs.unlinkSync(req.avatarsPath + user.avatar)
                    } catch (err) {
                      console.log(`Error deleting avatar: ${err.message}`)
                    }
                  }
                  user
                        .remove()
                        .then(() => {
                            // remove all references in property objects to this user
                          Property
                                .find({field: _id})
                                .then((properties) => {
                                    // loop trough each property to remove the user reference
                                  let removeUserRef = (i) => {
                                    if (typeof properties[i] === 'undefined') {
                                      return res.redirect('/' + action + '/list')
                                    }
                                    properties[i][field] = null
                                    properties[i]
                                            .save()
                                            .then((property) => {
                                              removeUserRef(++i)
                                            })
                                            .catch((err) => {
                                              return res.render('error', {
                                                pageTitle: pageTitle,
                                                message: 'Error removing reference to ' + role.toLowerCase() + '.',
                                                error: err
                                              })
                                            })
                                  }

                                  if (properties && properties.length) {
                                    removeUserRef(0)
                                  } else {
                                    res.redirect('/' + action + '/list')
                                  }
                                })
                                .catch((err) => {
                                  console.log('Error selecting ' + role.toLowerCase() + ' refs: ', err)
                                })
                        })
                        .catch((err) => {
                          console.log('Error deleting ' + role.toLowerCase() + ': ', err)
                        })
                })
                .catch((err) => {
                  res.render('error', {
                    pageTitle: pageTitle,
                    message: 'Error selecting ' + role.toLowerCase() + '.',
                    error: err
                  })
                })
    }
  },

  getList: (role) => {
    return (req, res, next) => {
      let field
      let roles
      if (role === 'Owner') {
        roles = ['Owner']
        field = 'owners'
        if (req.user.roles.indexOf('Owner') > -1) {
          req[field] = [req.user]
          return next()
        }
      } else {
        roles = ['Admin', 'Agent']
        field = 'agents'
      }

      let query = {
        roles: {
          $in: roles
        }
      }

      User
                .find(query)
                .sort('firstName')
                .sort('lastName')
                .limit(1000)
                .then((users) => {
                  req[field] = users
                  next()
                })
                .catch((err) => {
                  console.log('Error selecting ' + field + ': ', err)
                  next()
                })
    }
  }
}

// utility functions
function getPostedData (req) {
  let params = (req && req.body) || null

  let phones = []
  if (params && params.phoneNum) {
    if (!_.isArray(params.phoneNum)) {
      params.phoneNum = [params.phoneNum]
      params.phoneType = [params.phoneType]
    }
    params.phoneNum.forEach((phoneNum, i) => {
      phones.push({
        phoneNum: phoneNum,
        phoneType: params.phoneType[i]
      })
    })
  }

  let emails = []
  if (params && params.emails) {
    if (!_.isArray(params.emails)) {
      params.emails = [params.emails]
    }
    params.emails.forEach((email) => {
      emails.push(email)
    })
  }

  return {
    titleItems: defines.getUserTitles(),
    phoneTypes: defines.getPhoneTypes(),
    title: params.title || '',
    firstName: params.firstName || '',
    middleInit: params.middleInit || '',
    lastName: params.lastName || '',
    preferredName: params.preferredName || '',
    company: params.company || '',
    username: params.username || '',
    notes: params.notes || '',
    streetAddr: params.streetAddr || '',
    streetAddr2: params.streetAddr2 || '',
    city: params.city || '',
    state: params.state || '',
    zip: params.zip || '',
    emails: emails,
    phones: phones
  }
}

function getPageTitle (role) {
  let pageTitle = ''
  if (role === 'Owner') {
    pageTitle = 'Owner Information'
  } else {
    pageTitle = 'Agent Information'
  }

  return pageTitle
}
