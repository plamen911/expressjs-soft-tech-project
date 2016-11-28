/* globals require, module, process, __dirname */
'use strict'

const path = require('path')
const rootPath = path.normalize(path.join(__dirname, '/../../'))
const uploadPath = path.join(rootPath, '/public/uploads')
const port = process.env.PORT || 3000

module.exports = {
  development: {
    // db: 'mongodb://localhost:27017/rentalapp',
    db: 'mongodb://rentaluser:rentalapppassword@ds155097.mlab.com:55097/rentalapp',
    port: port,
    sessionSecter: '12?*RrfgysyuEssssZ90',
    rootPath: rootPath,
    uploadPath: uploadPath,
    avatarsPath: path.join(uploadPath, '/avatars/'),
    photosPath: path.join(uploadPath, '/photos/'),
    docsPath: path.join(uploadPath, '/docs/'),
    imageTypes: ['image/jpg', 'image/jpeg', 'image/png']
  },
  production: {
    // db: 'mongodb://localhost:27017/rentalapp',
    db: 'mongodb://rentaluser:rentalapppassword@ds155097.mlab.com:55097/rentalapp',
    port: port,
    sessionSecter: '12?*RrfgysyuEssssZ90',
    rootPath: rootPath,
    uploadPath: uploadPath,
    avatarsPath: path.join(uploadPath, '/avatars/'),
    photosPath: path.join(uploadPath, '/photos/'),
    docsPath: path.join(uploadPath, '/docs/'),
    imageTypes: ['image/jpg', 'image/jpeg', 'image/png']
  }
}
