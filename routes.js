'use strict'
const router = require('express').Router();
const dbController = require('./controllers/db_controller');
const sharepointController = require('./controllers/sharepoint_controller');
const fs = require('fs')

router.post('/connect', dbController.validateLogin);
router.post('/password', dbController.changePassword);
router.post('/downloadFile', sharepointController.downloadFile );
router.post('/cleanServer', (req, res)=>{
    const dir = './valoremFiles';
    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            throw err
        }
        console.log(`${dir} is deleted!`);
        return res.status(200).send({response: `${dir} is deleted!`})
    });
});
 
module.exports = router;

//change