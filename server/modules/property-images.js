/* globals require, module */
'use strict'

const defines = require('../utilities/defines')
const upload = require('../utilities/upload')
const fs = require('fs')
const _ = require('underscore')

const User = require('mongoose').model('User')
const Property = require('mongoose').model('Property')

let pageTitle = 'Property Images'
let tab = 'images'

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
                    tab: tab,
                    photosPath: config.photosPath,
                    propertyListUrl: req.session.propertyListUrl || '/property/list'
                }
                data = _.extend(getPostedData(req), data)
                data = _.extend(data, property)

                if (req.session.globalSuccess) {
                    data.globalSuccess = req.session.globalSuccess
                    delete req.session.globalSuccess
                }

                if (data.images) {
                    for (let i = 0; i < data.images.length; i++) {
                        data.images[i].imageFile = defines.getImgWithSuffix(data.images[i].imageFile, 'medium');
                    }
                }

                res.render('property/form', data)
            }
        ]
    },

    save: (app, config) => {
        return [
            upload(config.photosPath, config.imageTypes),
            (req, res, next) => {
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    tab: tab,
                    photosPath: config.photosPath,
                    propertyListUrl: req.session.propertyListUrl || '/property/list'
                })

                let errors = []
                let photos = []
                if (req.files && req.files['photos']) {
                    if (!_.isArray(req.files['photos'])) {
                        req.files['photos'] = [req.files['photos']]
                    }
                    req.files['photos'].forEach((photo) => {
                        if (photo.uploadErrors.length > 0) {
                            photo.uploadErrors.forEach((error) => {
                                errors.push(error)
                            })
                        } else {
                            photos.push({
                                imageFile: photo.fileName,
                                imageName: photo.originalFileName,
                                caption: ''
                            })
                        }
                    })
                }

                if (errors.length) {
                    data.globalError = errors.join('; ')
                    return res.render('/property/edit/' + _id + '/' + tab, data)
                }

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

                if (property.images) {
                    property.images.forEach((image, i) => {
                        property.images[i].caption = req.body.caption[i] || ''
                    })
                }
                if (photos.length) {
                    photos.forEach((photo) => {
                        property.images.push(photo)
                    })
                }

                property
                    .save()
                    .then((property) => {
                        req.property = property
                        next()
                    })
                    .catch((err) => {
                        data.globalError = 'Error updating image caption. ' + err.message
                        res.render('property/form', data)
                    })
            },
            (req, res, next) => {
                req.session.globalSuccess = 'Property successfully updated.'
                res.redirect('/property/edit/' + req.property._id + '/' + tab)
            }
        ]
    },

    sort: (arr, config) => {
        return [
            (req, res, next) => {
                let sortedList = []

                if (typeof req.body['image'] !== 'undefined') {
                    if (!_.isArray(req.body['image'])) {
                        req.body['image'] = [req.body['image']]
                    }
                    sortedList = req.body['image']
                }

                let property = req.property || null

                if (!property) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write('Property not found.');
                    res.end()
                    return
                }

                let images = []
                if (sortedList.length) {
                    sortedList.forEach((idx) => {
                        if (typeof property.images[idx] !== 'undefined') {
                            images.push(property.images[idx])
                        }
                    })
                }
                property.images = images

                property
                    .save()
                    .then((property) => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write('ok');
                        res.end();
                    })
                    .catch((err) => {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        res.write('Error updating image positions: ' + err.message);
                        res.end()
                    })
            }
        ]
    },

    delete: (arr, config) => {
        return [
            (req, res, next) => {
                let _id = req.params.id || 0
                let idx = req.params.idx || -1
                let data = _.extend(getPostedData(req), {
                    pageTitle: pageTitle,
                    formTitle: req.propertyQuickInfo,
                    tab: tab,
                    photosPath: config.photosPath,
                    propertyListUrl: req.session.propertyListUrl || '/property/list'
                })

                Property
                    .findOne({_id: _id})
                    .then((property) => {
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

                        let images = []
                        if (property.images) {
                            property.images.forEach((image, i) => {
                                if (i !== parseInt(idx, 10)) {
                                    images.push(image)
                                } else {
                                    try {
                                        fs.unlinkSync(config.photosPath + image.imageFile)
                                    } catch (err) {
                                        console.log(`Error deleting photo: ${err.message}`)
                                    }
                                }
                            })
                        }
                        property.images = images

                        property
                            .save()
                            .then((property) => {
                                res.redirect('/property/edit/' + _id + '/' + tab)
                            })
                            .catch((err) => {
                                data.globalError = 'Error updating image caption. ' + err.message
                                res.render('property/form', data)
                            })
                    })
                    .catch((err) => {
                        data.globalError = 'Error selecting property: ' + err.message
                        res.render('property/form', data)
                    })
            }
        ]
    }
}

// utility functions
function getPostedData (req) {
    let params = (req && req.body) || null

    if (params && params.caption) {
        if (!_.isArray(params.caption)) {
            params.caption = [params.caption]
        }
    }

    return {
        caption: params.caption || []
    }
}
