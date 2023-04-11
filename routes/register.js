const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

//banding a controller to a router method(post), next step should register this as middleware
router.post('/', registerController.handlerNewUser);

module.exports = router;
