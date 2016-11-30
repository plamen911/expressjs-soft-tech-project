/* globals require, module, plugin */
'use strict'

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const User = require('./User')
const requiredValidationMessage = '{PATH} is required'

let Schema = mongoose.Schema
mongoose.Promise = global.Promise

let propertySchema = mongoose.Schema({
  _owner: {type: Schema.ObjectId, ref: 'User'},
  _agent: {type: Schema.ObjectId, ref: 'User'},
  propertyName: {type: String, default: null},
  area: {type: String, default: null},
  streetAddr: {type: String, required: requiredValidationMessage, default: null},
  streetAddr2: {type: String, default: null},
  city: {type: String, default: null},
  state: {type: String, default: null},
  zip: {type: String, default: null},
  lat: {type: String, default: null},
  lng: {type: String, default: null},
  phone: {type: String, default: null},
  fax: {type: String, default: null},
  cleanningHours: {type: String, default: null},
  checkInTime: {type: String, default: null},
  checkOutTime: {type: String, default: null},
  showPropertyOnWeb: {type: String, default: 'No'},
  showAddressOnWeb: {type: String, default: 'No'},
  status: {type: String, default: 'Inactive'},
  notes: {type: String, default: null},
  comments: {type: String, default: null},
  description: {type: String, default: null},
  firstFloorDescription: {type: String, default: null},
  secondFloorDescription: {type: String, default: null},
  thirdFloorDescription: {type: String, default: null},
  lowerLevelDescription: {type: String, default: null},
  cottageDescription: {type: String, default: null},
  images: [{
    imageFile: {type: String, default: null},
    imageName: {type: String, default: null},
    caption: {type: String, default: null}
  }],
  bedrooms: [{
    bedroomType: {type: String, default: null},
    bedroomFloor: {type: String, default: null}
  }],
  bedroomsNum: {type: Number, default: 0},
  sleepingCapacity: {type: Number, default: 0},
  baths: [{
    bathType: {type: String, default: null},
    bathFloor: {type: String, default: null}
  }],
  bathsNum: {type: Number, default: 0},
    // amenities
    // household
  washer: {type: Boolean, default: false},
  dryer: {type: Boolean, default: false},
  iron: {type: Boolean, default: false},
  ironBoard: {type: Boolean, default: false},
  crib: {type: Boolean, default: false},
  highChair: {type: Boolean, default: false},
    // outdoors
  charcoalBBQ: {type: Boolean, default: false},
  gasBBQ: {type: Boolean, default: false},
  beachTowels: {type: Boolean, default: false},
  cooler: {type: Boolean, default: false},
  beachChairs: {type: Boolean, default: false},
  outdoorShower: {type: Boolean, default: false},
    // kitchen
  stove: {type: String, default: null},
  microwave: {type: Boolean, default: false},
  disposal: {type: Boolean, default: false},
  dishwasher: {type: Boolean, default: false},
  toaster: {type: Boolean, default: false},
  blender: {type: Boolean, default: false},
  mixer: {type: Boolean, default: false},
  coffeeMaker: {type: Boolean, default: false},
  foodProcessor: {type: Boolean, default: false},
  lobsterPot: {type: Boolean, default: false},
  // property
  yard: {type: Boolean, default: false},
  deck: {type: Boolean, default: false},
  porch: {type: Boolean, default: false},
  patio: {type: Boolean, default: false},
  outdoorFurniture: {type: Boolean, default: false},
  pool: {type: Boolean, default: false},
  hotTub: {type: Boolean, default: false},
  usableFireplace: {type: Boolean, default: false},
  woodStove: {type: Boolean, default: false},
  heat: {type: String, default: null},
  cooling: {type: String, default: null},
  createdAt: {type: Date, default: null},
  updatedAt: {type: Date, default: Date.now}
})

propertySchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date()
  }
  console.log('Saving property')
  next()
})

propertySchema.plugin(mongoosePaginate);

let Property = mongoose.model('Property', propertySchema)
