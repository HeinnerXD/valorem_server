'use strict'

const { sppull } = require("sppull");

function downloadModule(name, username, url, fileName, handler) {
    const context = {
        siteUrl: "https://valorem.sharepoint.com/it",
        creds: {
            name,
            username,
            password: "dpwlcnjfxqtpspgg"
        }
    };

    // https://valorem.sharepoint.com/it/HanaAplicaciones/Forms/AllItems.aspx?originalPath=aHR0cHM6Ly92YWxvcmVtLnNoYXJlcG9pbnQuY29tLzpmOi9nL2l0L0VsZ0ZMbTdIUFlKUHZkR1k1ZDd4cWhRQnNMdzZPbXdzWTh3dmFhYVk2MVo2SEE%5FcnRpbWU9QVF5TWZzdUEyRWc&viewid=aeac4170%2D90b8%2D4396%2Da152%2Defc38a33d0c4&id=%2Fit%2FHanaAplicaciones%2F01%2E%20TENANT%20VALOREM%2F01%2E%20VALOREM%2F02%2E%20NOTAS%20EEFF%2FPRODUCCION%2FINDIVIDUALES

    const options = {
        spRootFolder: "/HanaAplicaciones/01. TENANT VALOREM/01. VALOREM/" + url,
        dlRootFolder: './valoremFiles',
        strictObjects: [
            fileName
        ]
    };

    sppull(context, options)
        .then((downloadResults) => {
            console.log("Files are downloaded");
            console.log("For more, please check the results", JSON.stringify(downloadResults));
            handler(null, {success: "Files are downloaded: " + JSON.stringify(downloadResults)})
        })
        .catch((err) => {
            console.log("Core error has happened", err);
            handler({error: "Core error has happened", err}, null)
        });
}

module.exports = {
    downloadModule
}

//process.env.USERPROFILE + '/valoremFiles' || 

// creds: {
//     name: "DMSShuttle",
//     username: "lgarcia@valorem.com.co",
//     password: "dpwlcnjfxqtpspgg"
// }


//   var options = {
//     spRootFolder: "_catalogs/masterpage",
//     dlRootFolder: "./Downloads/Assets",
//     strictObjects: [
//         "/Display%20Templates/Search", // All files and folders under /subsite/_catalogs/masterpage/Display Templates/Search folder
//         "/Display%20Templates/Filters/Filter_Slider.js", // Only Filter_Slider.js from /subsite/_catalogs/masterpage/Display Templates/Filters
//         "/responsive.master" // Only responsive.master file from /subsite/_catalogs/masterpage
//     ]
// };