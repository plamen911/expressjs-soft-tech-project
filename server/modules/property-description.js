/* globals require, module */
'use strict'

const defines = require('../utilities/defines')
const _ = require('underscore')

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

let pageTitle = 'Property Description'
let tab = 'description'

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
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    tab: tab
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

    return {
        notes: params.notes || '',
        comments: params.comments || '',
        description: params.description || '',
        firstFloorDescription: params.firstFloorDescription || '',
        secondFloorDescription: params.secondFloorDescription || '',
        thirdFloorDescription: params.thirdFloorDescription || '',
        lowerLevelDescription: params.lowerLevelDescription || '',
        cottageDescription: params.cottageDescription || ''
    }
}
