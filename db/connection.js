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
      console.log("PASO LA CONEXION");
      conn.exec("SELECT * FROM GRANTED_ROLES WHERE GRANTEE='" + user.toUpperCase() + "'", function (err, resultLogin) {
        if (err) {
          handler(err, null)
        } else {
          console.log("PASO EL SELECT");
          conn.exec("SELECT PERIODO, HASTA FROM DWH_HDI_DB_1.BPC_PERIODO_VERSION WHERE VERSION ='REAL'", function (err, resultData) {
            if (err) {
              handler(err, null)
            } else {
              console.log("PASO EL SELECT PERIODO");
              console.log(resultLogin);
              console.log(resultData);
              var response = {
                response: 'Conectado a la base de datos',
                role: resultLogin,
                data: resultData
              }
              handler(null, response)
            }
          })
        }   
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

function unlockUserModule(user, email, handler) {
  var conn = hana.createConnection();
  var conn_params = {
    serverNode: keys.db_url,
    uid: "DWPORTAL",
    pwd: "Va10r3mh2022GT..",
    encrypt: "true",
    sslValidateCertiicate: "false"
  };

  console.log("Validating User")

  conn.connect(conn_params, function (err) {
    if (err) {
      handler(err, null)
    } else {
      conn.exec("SELECT * FROM USER_PARAMETERS WHERE USER_NAME='"+ user +"'", function (err, response) {
        if (err) {
          handler(err, null)
        } else {
          if(response.length === 0){
            handler("No se ha encontrado el usuario: " + user, null)
          }else {
            if(response[0].VALUE === email){
              console.log(response)
              conn.exec("ALTER USER "+ user +" ACTIVATE USER NOW", function (err, resultData) {
                if (err) {
                  handler(err, null)
                } else {
                  console.log("Usuario desbloqueado");
                  console.log(resultData);
                  var response = {
                    response: 'Usuario Desbloqueado',
                    user: user,
                    email: email
                  }
                  handler(null, response)
                }
              })
            } else {
              handler("Email incorrecto para el usuario: "+ user, null)
            }
          }
        }
      });
    }
  });
}

module.exports = { validateUserDb, changePasswordModule, unlockUserModule }

// {
//   "USER_NAME": "HSOUZA",
//   "PARAMETER": "EMAIL ADDRESS",
//   "VALUE": "HSOUZA@valorem.com.co"
// }