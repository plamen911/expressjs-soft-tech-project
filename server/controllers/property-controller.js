/* globals require, module */
'use strict'

const tabBasicInfo = require('../modules/property-basic-info')
const tabDescription = require('../modules/property-description')
const tabImages = require('../modules/property-images')
const tabBedrooms = require('../modules/property-bedrooms')
const tabAmenities = require('../modules/property-amenities')
const Property = require('mongoose').model('Property')

module.exports = {
  create: (app, config) => {
    return tabBasicInfo.create(app, config)
  },

  add: (app, config) => {
    return tabBasicInfo.add(app, config)
  },

  list: (app, config) => {
    return tabBasicInfo.list(app, config)
  },

  delete: (app, config) => {
    return tabBasicInfo.delete(app, config)
  },

  // property tabs
  edit: (app, config, tab) => {
    if (tab === 'images') {
      return [].concat(getPropertyInfo, tabImages.edit(app, config))
    } else if (tab === 'description') {
      return [].concat(getPropertyInfo, tabDescription.edit(app, config))
    } else if (tab === 'bedrooms') {
      return [].concat(getPropertyInfo, tabBedrooms.edit(app, config))
    }  else if (tab === 'amenities') {
      return [].concat(getPropertyInfo, tabAmenities.edit(app, config))
    } else {
      return [].concat(getPropertyInfo, tabBasicInfo.edit(app, config))
    }
  },

  save: (app, config, tab) => {
    if (tab === 'images-sort') {
        return [].concat(getPropertyInfo, tabImages.sort(app, config))
    } else if (tab === 'image-delete') {
        return [].concat(getPropertyInfo, tabImages.delete(app, config))
    } else if (tab === 'images') {
        return [].concat(getPropertyInfo, tabImages.save(app, config))
    } else if (tab === 'description') {
        return [].concat(getPropertyInfo, tabDescription.save(app, config))
    } else if (tab === 'bedrooms') {
        return [].concat(getPropertyInfo, tabBedrooms.save(app, config))
    } else if (tab === 'amenities') {
        return [].concat(getPropertyInfo, tabAmenities.save(app, config))
    } else {
        return [].concat(getPropertyInfo, tabBasicInfo.save(app, config))
    }
  }
}

// utility funcs
function getPropertyInfo(req, res, next) {
  let _id = req.params.id || 0

  Property
      .findOne({_id: _id})
      .populate('_owner') // <-- only works if you pushed refs to children
      .populate('_agent') // <-- only works if you pushed refs to children
      .then((property) => {
        req.property = property
        let propertyQuickInfo = 'Property Information'
        if (property) {
          propertyQuickInfo = 'Address: ' + property.streetAddr +
              ' | Owner: ' + property._owner.firstName + ' ' + property._owner.lastName +
              ' | Agent: ' + property._agent.firstName + ' ' + property._agent.lastName
        }
        req.propertyQuickInfo = propertyQuickInfo;
        next()
      })
      .catch((err) => {
        console.log('Cannot find property')
        next()
      })
}
