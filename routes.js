'use strict'
const router = require('express').Router();
const dbController = require('./controllers/db_controller');
const sharepointController = require('./controllers/sharepoint_controller');

router.post('/connect', dbController.validateLogin);
router.post('/password', dbController.changePassword);
router.post('/downloadFile', sharepointController.downloadFile );

module.exports = router;