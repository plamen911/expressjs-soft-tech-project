/* globals require, module */
'use strict'

const async = require('async')
const _ = require('underscore')
const moment = require('moment')
const defines = require('../utilities/defines')
const userMiddleware = require('../utilities/user-middleware')
const pagination = require('../utilities/pagination')

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

let getPropertyList = require('../data/Property').getPropertyList

let pageTitle = 'Property Information'
let tab = 'basic-info'

module.exports = {
    create: (app, config) => {
        return [
            userMiddleware.getList('Owner'),
            userMiddleware.getList('Agent'),
            (req, res, next) => {
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    formAction: '/property/add',
                    owners: req.owners,
                    agents: req.agents,
                    areas: defines.getAreas(),
                    newProperty: 1,
                    tab: tab
                })

                // form validation
                if (!data._owner) {
                    data.globalError = 'Owner is required'
                    return res.render('property/form', data)
                }
                if (!data._agent) {
                    data.globalError = 'Agent is required'
                    return res.render('property/form', data)
                }
                if (!data.area) {
                    data.globalError = 'Area is required'
                    return res.render('property/form', data)
                }
                if (!data.streetAddr) {
                    data.globalError = 'Street Address is required'
                    return res.render('property/form', data)
                }

                new Property(data)
                    .save()
                    .then((property) => {
                        req.property = property
                        next()
                    })
                    .catch((err) => {
                        data.globalError = 'Error saving new property. ' + err.message
                        res.render('property/form', data)
                    })
            },
            unlinkPropertyFromOwner,
            linkPropertyToOwner,
            unlinkPropertyFromAgent,
            linkPropertyToAgent,
            (req, res, next) => {
                req.session.globalSuccess = 'New property successfully added.'
                res.redirect('/property/edit/' + req.property._id)
            }
        ]
    },

    edit: (app, config) => {
        return [
            userMiddleware.getList('Owner'),
            userMiddleware.getList('Agent'),
            (req, res, next) => {
                let _id = req.params.id || 0

                Property
                    .findOne({_id: _id})
                    .then((property) => {
                        let data = {
                            pageTitle: pageTitle,
                            formTitle: req.propertyQuickInfo,
                            formAction: '/property/edit/' + property._id,
                            owners: req.owners,
                            agents: req.agents,
                            areas: defines.getAreas(),
                            _id: _id,
                            tab: tab
                        }

                        data = _.extend(getPostedData(req), data)
                        data = _.extend(data, property)

                        data._owner = (data._owner && data._owner.toString()) || null
                        data._agent = (data._agent && data._agent.toString()) || null

                        if (req.session.globalSuccess) {
                            data.globalSuccess = req.session.globalSuccess
                            delete req.session.globalSuccess
                        }
                        res.render('property/form', data)
                    })
                    .catch((err) => {
                        res.render('error', {
                            pageTitle: pageTitle,
                            message: 'Error selecting property.',
                            error: err
                        })
                    })
            }
        ]
    },

    save: (app, config) => {
        return [
            userMiddleware.getList('Owner'),
            userMiddleware.getList('Agent'),
            (req, res, next) => {
                let _id = req.params.id || 0
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    formAction: '/property/edit/' + _id,
                    owners: req.owners,
                    agents: req.agents,
                    areas: defines.getAreas(),
                    _id: _id,
                    tab: tab
                })

                // form validation
                if (!data._owner) {
                    data.globalError = 'Owner is required'
                    return res.render('property/form', data)
                }
                if (!data._agent) {
                    data.globalError = 'Agent is required'
                    return res.render('property/form', data)
                }
                if (!data.area) {
                    data.globalError = 'Area is required'
                    return res.render('property/form', data)
                }
                if (!data.streetAddr) {
                    data.globalError = 'Street Address is required'
                    return res.render('property/form', data)
                }

                Property
                    .findOne({_id: _id})
                    .then((property) => {
                        req.old_owner = property._owner
                        req.old_agent = property._agent

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
                    })
                    .catch((err) => {
                        data.globalError = 'Error selecting property: ' + err.message
                        res.render('property/form', data)
                    })
            },
            unlinkPropertyFromOwner,
            linkPropertyToOwner,
            unlinkPropertyFromAgent,
            linkPropertyToAgent,
            (req, res, next) => {
                req.session.globalSuccess = 'Property successfully updated.'
                res.redirect('/property/edit/' + req.property._id)
            }
        ]
    },

    add: (app, config) => {
        return [
            userMiddleware.getList('Owner'),
            userMiddleware.getList('Agent'),
            (req, res, next) => {
                let pageTitle = 'Add New Property'
                let data = {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    formAction: '/property/add',
                    owners: req.owners,
                    agents: req.agents,
                    areas: defines.getAreas(),
                    tab: tab
                }
                data = _.extend(getPostedData(req), data)
                res.render('property/form', data)
            }
        ]
    },

    list: (app, config) => {
        return [
            (req, res, next) => {
                let pageTitle = 'Property List'
                let action = 'property'
                let keyword = req.query.keyword || null
                let limit = (req.query.limit && parseInt(req.query.limit, 10)) || 10

                getPropertyList(req)
                    .then(result => {
                        let data = {
                            pageTitle: pageTitle,
                            action: action,
                            moment: moment,
                            keyword: keyword,
                            limit: limit,
                            limitOpts: [10, 25, 50, 100],
                            rows: result.data,
                            pagination: result
                        }
                        res.render('property/list', data)
                    })
                    .catch(err => {
                        res.render('error', {
                            pageTitle: pageTitle,
                            message: 'Error selecting properties.',
                            error: err
                        })
                    })
            }
        ]
    },

    delete: (app, config) => {
        return [
            userMiddleware.getList('Owner'),
            userMiddleware.getList('Agent'),
            defines.setConfig(config),
            (req, res, next) => {
                let _id = req.params.id || 0

                Property
                    .findOne({_id: _id})
                    .then((property) => {
                        if (req.user.roles.indexOf('Owner') > -1 &&
                            property._owner.toString() !== req.user._id.toString()) {
                            console.log('Logged-in owner is not allowed to do this action.')
                            return res.redirect('/property/list')
                        }

                        property
                            .remove()
                            .then(() => {
                                req.property = {
                                    _owner: '',
                                    _agent: ''
                                }

                                req.old_owner = property._owner
                                req.old_agent = property._agent
                                next()
                            })
                            .catch((err) => {
                                res.render('error', {
                                    pageTitle: pageTitle,
                                    message: 'Error deleting property.',
                                    error: err
                                })
                            })
                    })
                    .catch((err) => {
                        res.render('error', {
                            pageTitle: pageTitle,
                            message: 'Error selecting property.',
                            error: err
                        })
                    })
            },
            unlinkPropertyFromOwner,
            unlinkPropertyFromAgent,
            (req, res, next) => {
                res.redirect('/property/list')
            }
        ]
    }
}

// utility functions
function getPostedData(req) {
    let params = (req && req.body) || null

    return {
        _owner: params._owner || '',
        _agent: params._agent || '',
        propertyName: params.propertyName || '',
        area: params.area || '',
        streetAddr: params.streetAddr || '',
        streetAddr2: params.streetAddr2 || '',
        city: params.city || '',
        state: params.state || '',
        zip: params.zip || '',
        lat: params.lat || '',
        lng: params.lng || '',
        phone: params.phone || '',
        fax: params.fax || '',
        cleanningHours: params.cleanningHours || '',
        checkInTime: params.checkInTime || '',
        checkOutTime: params.checkOutTime || '',
        showPropertyOnWeb: params.showPropertyOnWeb || 'No',
        showAddressOnWeb: params.showAddressOnWeb || 'No',
        status: params.status || 'Inactive',
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

function unlinkPropertyFromOwner(req, res, next) {
    if (req.old_owner && req.old_owner.toString() !== req.property._owner.toString()) {
        User
            .findOne({_id: req.old_owner})
            .then((owner) => {
                let properties = owner.properties || []
                if (properties.length) {
                    let index = _.indexOf(properties, req.old_owner.toString())
                    properties.splice(index, 1)
                }
                owner.properties = properties
                owner
                    .save()
                    .then((owner) => {
                        next()
                    })
                    .catch((err) => {
                        res.render('error', {
                            pageTitle: pageTitle,
                            message: 'Error updating owner.',
                            error: err
                        })
                    })
            })
            .catch((err) => {
                res.render('error', {
                    pageTitle: pageTitle,
                    message: 'Error selecting owner.',
                    error: err
                })
            })
    } else {
        next()
    }
}

// saving a ref. to this property in owner's object
function linkPropertyToOwner(req, res, next) {
    User
        .findOne({_id: req.property._owner})
        .then((owner) => {
            let properties = owner.properties || []
            properties.push(req.property._id)
            properties = _.uniq(properties, (property) => {
                return property.toString()
            })
            owner.properties = properties
            owner
                .save()
                .then((owner) => {
                    next()
                })
                .catch((err) => {
                    res.render('error', {
                        pageTitle: pageTitle,
                        message: 'Error updating owner.',
                        error: err
                    })
                })
        })
        .catch((err) => {
            res.render('error', {
                pageTitle: pageTitle,
                message: 'Error selecting owner.',
                error: err
            })
        })
}

function unlinkPropertyFromAgent(req, res, next) {
    if (req.old_agent && req.old_agent.toString() !== req.property._agent.toString()) {
        User
            .findOne({_id: req.old_agent})
            .then((agent) => {
                let properties = agent.properties || []
                if (properties.length) {
                    let index = _.indexOf(properties, req.old_agent.toString())
                    properties.splice(index, 1)
                }
                agent.properties = properties
                agent
                    .save()
                    .then((agent) => {
                        next()
                    })
                    .catch((err) => {
                        res.render('error', {
                            pageTitle: pageTitle,
                            message: 'Error updating agent.',
                            error: err
                        })
                    })
            })
            .catch((err) => {
                res.render('error', {
                    pageTitle: pageTitle,
                    message: 'Error selecting agent.',
                    error: err
                })
            })
    } else {
        next()
    }
}

// saving a ref. to this property in agent's object
function linkPropertyToAgent(req, res, next) {
    User
        .findOne({_id: req.property._agent})
        .then((agent) => {
            let properties = agent.properties || []
            properties.push(req.property._id)
            properties = _.uniq(properties, (property) => {
                return property.toString()
            })
            agent.properties = properties
            agent
                .save()
                .then((agent) => {
                    next()
                })
                .catch((err) => {
                    res.render('error', {
                        pageTitle: pageTitle,
                        message: 'Error updating agent.',
                        error: err
                    })
                })
        })
        .catch((err) => {
            res.render('error', {
                pageTitle: pageTitle,
                message: 'Error selecting agent.',
                error: err
            })
        })
}

