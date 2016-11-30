/* globals require, module */
'use strict'

const controllers = require('../controllers')
const auth = require('../config/auth')
const upload = require('../utilities/upload')
const defines = require('../utilities/defines')

module.exports = (app, config) => {
  app.get('/user/register', controllers.user.register)
  app.post('/user/register', controllers.user.create)
  app.get('/user/login', controllers.user.login)
  app.post('/user/login', controllers.user.authenticate)
  app.post('/user/logout', controllers.user.logout)

  // properties
  app.get('/', [].concat(auth.isAuthenticated, controllers.property.list(app, config)))
  app.get('/property', [].concat(auth.isAuthenticated, controllers.property.list(app, config)))
  app.get('/property/list', [].concat(auth.isAuthenticated, controllers.property.list(app, config)))
  app.get('/property/add', [].concat(auth.isAuthenticated, controllers.property.add(app, config)))
  app.post('/property/add', [].concat(auth.isAuthenticated, controllers.property.create(app, config)))
  // property tabs start
  app.get('/property/edit/:id', [].concat(auth.isAuthenticated, controllers.property.edit(app, config)))
  app.get('/property/edit/:id/basic-info', [].concat(auth.isAuthenticated, controllers.property.edit(app, config)))
  app.post('/property/edit/:id', [].concat(auth.isAuthenticated, controllers.property.save(app, config)))
  app.post('/property/edit/:id/basic-info', [].concat(auth.isAuthenticated, controllers.property.save(app, config)))
  app.get('/property/edit/:id/description', [].concat(auth.isAuthenticated, controllers.property.edit(app, config, 'description')))
  app.post('/property/edit/:id/description', [].concat(auth.isAuthenticated, controllers.property.save(app, config, 'description')))
  app.get('/property/edit/:id/images', [].concat(auth.isAuthenticated, controllers.property.edit(app, config, 'images')))
  app.post('/property/edit/:id/images/sort', [].concat(auth.isAuthenticated, controllers.property.save(app, config, 'images-sort')))
  app.get('/property/edit/:id/images/delete/:idx', [].concat(auth.isAuthenticated, controllers.property.save(app, config, 'image-delete')))
  app.post('/property/edit/:id/images', [].concat(auth.isAuthenticated, controllers.property.save(app, config, 'images')))
  app.get('/property/edit/:id/bedrooms', [].concat(auth.isAuthenticated, controllers.property.edit(app, config, 'bedrooms')))
  app.post('/property/edit/:id/bedrooms', [].concat(auth.isAuthenticated, controllers.property.save(app, config, 'bedrooms')))
  app.get('/property/edit/:id/amenities', [].concat(auth.isAuthenticated, controllers.property.edit(app, config, 'amenities')))
  app.post('/property/edit/:id/amenities', [].concat(auth.isAuthenticated, controllers.property.save(app, config, 'amenities')))
  // property tabs end
  app.get('/property/delete/:id', [].concat(auth.isAuthenticated, controllers.property.delete(app, config)))

  // agents
  app.get('/agent/list', [].concat(auth.isAuthenticated, controllers.agent.list(app, config)))
  app.get('/agent/add', [].concat(auth.isAuthenticated, controllers.agent.add(app, config)))
  app.post('/agent/add', [].concat(auth.isAuthenticated, controllers.agent.create(app, config)))
  app.get('/agent/edit/:id', [].concat(auth.isAuthenticated, controllers.agent.edit(app, config)))
  app.post('/agent/edit/:id', [].concat(auth.isAuthenticated, controllers.agent.save(app, config)))
  app.get('/agent/delete/:id', [].concat(auth.isAuthenticated, controllers.agent.delete(app, config)))

  // owners
  app.get('/owner/list', [].concat(auth.isAuthenticated, controllers.owner.list(app, config)))
  app.get('/owner/add', [].concat(auth.isAuthenticated, controllers.owner.add(app, config)))
  app.post('/owner/add', [].concat(auth.isAuthenticated, controllers.owner.create(app, config)))
  app.get('/owner/edit/:id', [].concat(auth.isAuthenticated, controllers.owner.edit(app, config)))
  app.post('/owner/edit/:id', [].concat(auth.isAuthenticated, controllers.owner.save(app, config)))
  app.get('/owner/delete/:id', [].concat(auth.isAuthenticated, controllers.owner.delete(app, config)))

  app.get('/test', [].concat(auth.isAuthenticated, controllers.property.test(app, config, '')))

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found')
    res.end()
  })
}
