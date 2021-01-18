'use strict'

const keys = require('../keys');
var hana = require('@sap/hana-client');

function validateUserDb(user, password, handler) {
  var conn = hana.createConnection();
  var conn_params = {
    serverNode: keys.db_url,
    uid: user,
    pwd: password,
    encrypt: "true",
    sslValidateCertiicate: "false"
  };

  conn.connect(conn_params, function (err) {
    if (err) {
      handler(err, null)
    } else {
      conn.exec("SELECT * FROM GRANTED_ROLES WHERE GRANTEE='" + user.toUpperCase() + "'", function (err, result) {
        if (err) throw err;
        console.log(result);
        // output --> Name: Tee Shirt, Description: V-neck
        var response = {
          response: 'Conectado a la base de datos',
          role: result
        }
        handler(null, response)

      })

    }
  });
}

function changePasswordModule(user, password, newPassword, handler) {
  var conn = hana.createConnection();
  var conn_params = {
    serverNode: keys.db_url,
    uid: user,
    pwd: password,
    encrypt: "true",
    sslValidateCertiicate: "false"
  };

  conn.connect(conn_params, function (err) {
    if (err) {
      handler(err, null)
    } else {
      conn.exec("ALTER USER " + user + " PASSWORD " + newPassword, function (err, response) {
        if (err) {
          handler(err, null)
        } else {
          handler(null, 'Conectado a la base de datos: ' + response)
        }
      });
    }
  });
}

module.exports = { validateUserDb, changePasswordModule }