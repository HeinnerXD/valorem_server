'use strict'
const router = require('express').Router();
const dbController = require('./controllers/db_controller');

router.post('/connect', dbController.validateLogin);
router.put('/password', dbController.changePassword);

module.exports = router;