/* globals require, module */
'use strict'

const defines = require('../utilities/defines')
const _ = require('underscore')

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

let pageTitle = 'Property Bedrooms'
let tab = 'bedrooms'

module.exports = {
    edit: (app, config) => {
        return [
            (req, res, next) => {
                let property = req.property || null

                if (!property) {
                    let err = new Error('Not Found')
                    err.status = 404
                    return res.render('error', {
                        pageTitle: pageTitle,
                        message: 'Property not found.',
                        error: err
                    })
                }
                let data = {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    _id: property._id,
                    tab: tab
                }
                data = _.extend(getPostedData(req), data)
                data = _.extend(data, property)

                if (req.session.globalSuccess) {
                    data.globalSuccess = req.session.globalSuccess
                    delete req.session.globalSuccess
                }
                res.render('property/form', data)
            }
        ]
    },

    save: (app, config) => {
        return [
            (req, res, next) => {
                let _id = req.params.id || 0
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    tab: tab,
                    propertyQuickInfo: req.propertyQuickInfo
                })

                let property = req.property || null

                if (!property) {
                    let err = new Error('Not Found')
                    err.status = 404
                    return res.render('error', {
                        pageTitle: pageTitle,
                        message: 'Property not found.',
                        error: err
                    })
                }

                if (req.user.roles.indexOf('Owner') > -1 &&
                    property._owner.toString() !== req.user._id.toString()) {
                    data.globalError = 'You are not allowed to do this action.'
                    return res.render('property/form', data)
                }

                property = _.extend(property, data)
                property
                    .save()
                    .then((property) => {
                        req.property = property
                        next()
                    })
                    .catch((err) => {
                        data.globalError = 'Error updating property. ' + err.message
                        res.render('property/form', data)
                    })
            },
            (req, res, next) => {
                req.session.globalSuccess = 'Property successfully updated.'
                res.redirect('/property/edit/' + req.property._id + '/' + tab)
            }
        ]
    }
}

// utility functions
function getPostedData (req) {
    let params = (req && req.body) || null

    let bedrooms = []
    if (params && params.bedroomType) {
        if (!_.isArray(params.bedroomType)) {
            params.bedroomType = [params.bedroomType]
            params.bedroomFloor = [params.bedroomFloor]
        }
        params.bedroomType.forEach((bedroomType, i) => {
            bedrooms.push({
                bedroomType: bedroomType,
                bedroomFloor: params.bedroomFloor[i]
            })
        })
    }

    let baths = []
    if (params && params.bathType) {
        if (!_.isArray(params.bathType)) {
            params.bathType = [params.bathType]
            params.bathFloor = [params.bathFloor]
        }
        params.bathType.forEach((bathType, i) => {
            baths.push({
                bathType: bathType,
                bathFloor: params.bathFloor[i]
            })
        })
    }

    return {
        bedroomTypes: defines.getBedroomTypes(),
        bathTypes: defines.getBathTypes(),
        floors: defines.getFloors(),
        bedrooms: bedrooms,
        bedroomsNum: params.bedroomsNum || '',
        sleepingCapacity: params.sleepingCapacity || '',
        baths: baths,
        bathsNum: params.bathsNum || ''
    }
}
