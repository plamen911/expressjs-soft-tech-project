/* globals require, module */
'use strict'

const propertyController = require('./property-controller')
const userController = require('./user-controller')
const ownerController = require('./owner-controller')
const agentController = require('./agent-controller')

module.exports = {
  property: propertyController,
  user: userController,
  owner: ownerController,
  agent: agentController
}
