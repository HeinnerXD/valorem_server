'use strict'

const  downloadModule  = require('../modules/download-file');

function downloadFile(req, res) {
    downloadModule.downloadModule(req.body.name, req.body.username, req.body.url, req.body.fileName, (error, response)=>{
        if (error) {
            return res.status(500).send(error);
        } else {
            if (response) {
                return res.status(200).send(response);
            } else {
                return res.status(404).send({error: "Could not resolve post, verify console."})
            }
        }
    })
}

module.exports = {
    downloadFile
}