/* globals require, module */
'use strict'

const defines = require('../utilities/defines')
const _ = require('underscore')

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

let pageTitle = 'Property Amenities'
let tab = 'amenities'

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
                let property = req.property || null
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    tab: tab
                })

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
        washer: params.washer && '1' === params.washer || false,
        dryer: params.dryer && '1' === params.dryer || false,
        iron: params.iron && '1' === params.iron || false,
        ironBoard: params.ironBoard && '1' === params.ironBoard || false,
        crib: params.crib && '1' === params.crib || false,
        highChair: params.highChair && '1' === params.highChair || false,
        charcoalBBQ: params.charcoalBBQ && '1' === params.charcoalBBQ || false,
        gasBBQ: params.gasBBQ && '1' === params.gasBBQ || false,
        beachTowels: params.beachTowels && '1' === params.beachTowels || false,
        cooler: params.cooler && '1' === params.cooler || false,
        beachChairs: params.beachChairs && '1' === params.beachChairs || false,
        outdoorShower: params.outdoorShower && '1' === params.outdoorShower || false,
        stove: params.stove || '',
        microwave: params.microwave && '1' === params.microwave || false,
        disposal: params.disposal && '1' === params.disposal || false,
        dishwasher: params.dishwasher && '1' === params.dishwasher || false,
        toaster: params.toaster && '1' === params.toaster || false,
        blender: params.blender && '1' === params.blender || false,
        mixer: params.mixer && '1' === params.mixer || false,
        coffeeMaker: params.coffeeMaker && '1' === params.coffeeMaker || false,
        foodProcessor: params.foodProcessor && '1' === params.foodProcessor || false,
        lobsterPot: params.lobsterPot && '1' === params.lobsterPot || false,
        yard: params.yard && '1' === params.yard || false,
        deck: params.deck && '1' === params.deck || false,
        porch: params.porch && '1' === params.porch || false,
        patio: params.patio && '1' === params.patio || false,
        outdoorFurniture: params.outdoorFurniture && '1' === params.outdoorFurniture || false,
        pool: params.pool && '1' === params.pool || false,
        hotTub: params.hotTub && '1' === params.hotTub || false,
        usableFireplace: params.usableFireplace && '1' === params.usableFireplace || false,
        woodStove: params.woodStove && '1' === params.woodStove || false,
        heat: params.heat || '',
        cooling: params.cooling || ''
    }
}
