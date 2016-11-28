/* globals require, module */
'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const uid = require('uid2')
const request = require('request')
const _ = require('underscore')

module.exports = (uploadDir, allowedMimes) => {
  return (req, res, next) => {
    let writeStream
    let errors = []
    let files = []

    req.pipe(req.busboy)

    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if (filename) {

        let targetPath
        let targetName

        // get the extenstion of the file
        let extension = filename.split(/[. ]+/).pop()

        // create a new name for the image
        targetName = uid(22) + '.' + extension

        if (typeof req.files === 'undefined') {
          req.files = {}
        }

        let fileData = {
          originalFileName: filename,
          fileExtension: extension,
          mimeType: mimetype,
          fileName: targetName,
          uploadErrors: []
        }

        let appendFileData = (value) => {
          let key = fieldname.replace(/[^a-z0-9_]/gi, '')
          if (req.files.hasOwnProperty(key)) {
            if (_.isArray(req.files[key])) {
              req.files[key].push(value)
            } else {
              req.files[key] = [req.files[key], value]
            }
          } else {
            req.files[key] = value
          }
        }

        // check to see if we support the file type
        if (allowedMimes && allowedMimes.indexOf(mimetype) === -1) {
          let types = []
          for (let i in allowedMimes) {
            if (allowedMimes.hasOwnProperty(i)) {
              types.push(allowedMimes[i].split(/[\/ ]+/).pop())
            }
          }
          errors.push('Supported image formats: ' + types.join(', ') + '.')
          fileData.uploadErrors = errors
          appendFileData(fileData)
          return file.resume()
        }

        appendFileData(fileData)

        //var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
        // determine the new path to save the image
        targetPath = path.join(os.tmpDir(), targetName)

        writeStream = fs.createWriteStream(targetPath)
        file.pipe(writeStream)

        writeStream.on('close', () => {
          //
        })

        files.push({
          targetName: targetName,
          targetPath: targetPath
        })


      } else {
        file.resume()
      }
    })

    req.busboy.on('field', (key, value, keyTruncated, valueTruncated) => {
      key = key.replace(/[^a-z0-9_]/gi, '')
      if (req.body.hasOwnProperty(key)) {
        if (_.isArray(req.body[key])) {
          req.body[key].push(value)
        } else {
          req.body[key] = [req.body[key], value]
        }
      } else {
        req.body[key] = value
      }
    })

    req.busboy.on('finish', () => {
      if (files.length) {
        let uploadFile = (idx) => {
          if (typeof files[idx] === 'undefined') {
            console.log('File upload finished...')
            return next()
          }

          let targetPath = files[idx].targetPath
          let targetName = files[idx].targetName

          // upload to remote server
          let r = request.post('http://hipokrat.net/rentalapp/upload.php',
              (err, httpResponse, body) => {
                if (err) {
                  console.log('upload failed:', err);
                  return uploadFile(++idx);
                }
                console.log('Upload of ' + targetName + ' successful! Server responded with:', body);
                uploadFile(++idx)
              })
          let form = r.form()
          form.append('uploadDir', uploadDir.substring(0, uploadDir.length - 1).split(/\//).pop())
          form.append('upfile', fs.createReadStream(targetPath))
        }

        uploadFile(0)

      } else {
        console.log('No files to upload...')
        next()
      }
    })
  }
}
