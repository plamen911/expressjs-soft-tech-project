/* globals require, module */
'use strict'

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

const tabBasicInfo = require('../modules/property-basic-info')
const tabDescription = require('../modules/property-description')
const tabImages = require('../modules/property-images')
const tabBedrooms = require('../modules/property-bedrooms')
const tabAmenities = require('../modules/property-amenities')

const pagination = require('../utilities/pagination')

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
  },

  test: (app, config, tab) => {
      return [
          (req, res, next) => {



              function getPropertyList() {
                  return new Promise((resolve, reject) => {
                      let keyword = 'Sch'
                      let limit = 10
                      let regexp = '';

                      if (keyword) {
                          regexp = keyword.split(/\s+|,/)
                              .filter(function (kw) {
                                  return kw && kw.length > 1
                              })
                              .join('|')
                      }

                      let getOwnerAndAgentIDs = (regexp) => {
                          return new Promise((resolve, reject) => {
                              if (regexp) {
                                  const query = {
                                      "$or": [
                                          {
                                              "firstName": {
                                                  "$regex": regexp,
                                                  "$options": "i"
                                              }
                                          },
                                          {
                                              "lastName": {
                                                  "$regex": regexp,
                                                  "$options": "i"
                                              }
                                          }
                                      ]
                                  }

                                  User
                                      .find(query)
                                      .then(users => {
                                          return resolve(users.map(user => { return user._id }))
                                      })
                                      .catch(err => {
                                          return reject(err)
                                      })

                              } else {
                                  resolve([])
                              }
                          })
                      }

                      let getPropertyList = (oIDs) => {
                          return new Promise((resolve, reject) => {

                              const query = {}

                              if (oIDs && oIDs.length) {
                                  query['$or'] = []
                                  oIDs.forEach(oid => {
                                      let condition1 = {
                                          '_owner': oid
                                      }
                                      let condition2 = {
                                          '_agent': oid
                                      }
                                      query['$or'].push(condition1)
                                      query['$or'].push(condition2)
                                  })
                              }

                              console.log('query: ', query)

                              const options = {
                                  populate: '_owner _agent',
                                  sort: {area: 1, streetAddr: 1, createdAt: -1},
                                  lean: true,
                                  page: req.query.page || 1,
                                  limit: limit
                              }

                              Property
                                  .paginate(query, options)
                                  .then(result => {
                                      return resolve(pagination(req, result))
                                  })
                                  .catch(err => {
                                      return reject(err)
                                  })
                          })
                      }

                      getOwnerAndAgentIDs()
                          .then(getPropertyList)
                          .then((results) => {
                              return resolve(results)
                          })
                          .catch(err => {
                              return reject(err)
                          })
                  })
              }

              getPropertyList()
                  .then(results => {
                      console.log('Success: ', results)
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify(results))
                      res.end()
                  })
                  .catch(err => {
                      console.log('Err: ', err)
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify(err))
                      res.end()
                  })
          }
      ]
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
