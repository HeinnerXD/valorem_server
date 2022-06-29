'use strict'
const router = require('express').Router();
const dbController = require('./controllers/db_controller');
const sharepointController = require('./controllers/sharepoint_controller');
const fs = require('fs');
var rimraf = require("rimraf");

router.post('/connect', dbController.validateLogin);
router.post('/password', dbController.changePassword);
router.post('/unlockUser', dbController.unlockUser);
router.post('/downloadFile', sharepointController.downloadFile);
router.post('/downloadFileRoot', sharepointController.downloadFileRoot);
router.post('/cleanServer', (req, res) => {
    rimraf("./valoremFiles", function () { 
        res.status(200).send({response: "Directory deleted"})
    });
});

module.exports = router;