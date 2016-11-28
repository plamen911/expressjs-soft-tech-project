/* globals require, module */
'use strict'

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
let Property = require('./Property')
const encryption = require('../utilities/encryption')
const requiredValidationMessage = '{PATH} is required'

let Schema = mongoose.Schema
mongoose.Promise = global.Promise

let userSchema = mongoose.Schema({
  username: {type: String, required: requiredValidationMessage, unique: true},
  salt: String,
  hashedPass: String,
  roles: [String],
  title: {type: String, default: null},
  firstName: {type: String, required: requiredValidationMessage},
  middleInit: {type: String, default: null},
  lastName: {type: String, required: requiredValidationMessage},
  preferredName: {type: String, default: null},
  company: {type: String, default: null},
  notes: {type: String, default: null},
  streetAddr: {type: String, default: null},
  streetAddr2: {type: String, default: null},
  city: {type: String, default: null},
  state: {type: String, default: null},
  zip: {type: String, default: null},
  emails: {type: [String], default: []},
  phones: [{
    phoneNum: {type: String, default: null},
    phoneType: {type: String, default: null}
  }],
  properties: [{type: Schema.ObjectId, ref: 'Property', default: null}],
  createdAt: {type: Date, default: null},
  updatedAt: {type: Date, default: Date.now},
  avatar: {type: String, default: null}
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date()
  }
  console.log('Saving user')
  next()
})

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Username is already in use'))
  } else {
    next(error)
  }
})

userSchema.method({
  authenticate: function (password) {
    if (encryption.generateHashedPassword(this.salt, password) === this.hashedPass) {
      return true
    } else {
      return false
    }
  }
})

userSchema.plugin(mongoosePaginate);

let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
  User
        .find({})
        .then((users) => {
          if (users.length > 0) return

          let salt = encryption.generateSalt()
          let hashedPass = encryption.generateHashedPassword(salt, 'password')
          let data = {
            username: 'admin',
            firstName: 'Plamen',
            lastName: 'Markov',
            salt: salt,
            hashedPass: hashedPass,
            roles: ['Admin']
          }

          new User(data)
                .save()
                .then((user) => {
                  console.log('Admin user successfully seeded.')
                })
                .catch((err) => {
                  console.log('Error seeding admin user: ', err)
                })
        })
        .catch((err) => {
          console.log('Error selecting users: ', err)
        })
}
