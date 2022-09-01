"use strict";

const keys = require("../keys");
var hana = require("@sap/hana-client");

function validateUserDb(user, password, handler) {
  var conn = hana.createConnection();
  var conn_params = {
    serverNode: keys.db_url,
    uid: user,
    pwd: password,
    encrypt: "true",
    sslValidateCertiicate: "false",
  };

  conn.connect(conn_params, function (err) {
    if (err) {
      handler(err, null);
    } else {
      conn.exec(
        "SELECT * FROM GRANTED_ROLES WHERE GRANTEE='" +
          user.toUpperCase() +
          "'",
        function (err, resultLogin) {
          if (err) {
            handler(err, null);
          } else {
            conn.exec(
              "SELECT PERIODO, HASTA FROM DWH_HDI_DB_1.BPC_PERIODO_VERSION WHERE VERSION ='REAL'",
              function (err, resultData) {
                if (err) {
                  handler(err, null);
                } else {
                  const sqlSentence = `SELECT * FROM DWH_HDI_DB_1.BPC_ESTADO_USUARIO WHERE USUARIO = '${user}'`;
                  conn.exec(sqlSentence, function (err, resultStatus) {
                    if (err) {
                      handler(err, null);
                    } else {
                      const sqlSentence = `SELECT TOP 1 PERIODO, HASTA FROM DWH_HDI_DB_1. BPC_PERIODO_VERSION_GNONE`;
                      conn.exec(sqlSentence, function (err, resultPeriodos) {
                        if (err) {
                          handler(err, null);
                        } else {
                          var response = {
                            response: "Conectado a la base de datos",
                            role: resultLogin,
                            data: resultData,
                            status: resultStatus,
                            periodos: resultPeriodos,
                          };
                          handler(null, response);
                        }
                      });
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
}

function changePasswordModule(user, password, newPassword, checkKoba, handler) {
  var conn = hana.createConnection();
  var dbUrlPort = keys.db_url;
  if (checkKoba === "true") {
    dbUrlPort = keys.db_url_koba;
  }
  var conn_params = {
    serverNode: dbUrlPort,
    uid: user,
    pwd: password,
    encrypt: "true",
    sslValidateCertiicate: "false",
  };
  conn.connect(conn_params, function (err) {
    if (err) {
      handler(err, null);
    } else {
      const sqlSentence = `ALTER USER ${user} PASSWORD "${newPassword}"`;
      conn.exec(sqlSentence, function (err, response) {
        if (err) {
          handler(err, null);
        } else {
          handler(null, "Conectado a la base de datos: " + response);
        }
      });
    }
  });
}

function unlockUserModule(user, email, checkKoba, handler) {
  var conn = hana.createConnection();
  var dbUrlPort = keys.db_url;
  if (checkKoba === "true") {
    dbUrlPort = keys.db_url_koba;
  }
  var conn_params = {
    serverNode: dbUrlPort,
    uid: "DWPORTAL",
    pwd: "Va10r3mh2022GT..",
    encrypt: "true",
    sslValidateCertiicate: "false",
  };
  conn.connect(conn_params, function (err) {
    if (err) {
      handler(err, null);
    } else {
      const sqlSentenceInitial = `SELECT * FROM USER_PARAMETERS WHERE USER_NAME='${user}'`;
      conn.exec(sqlSentenceInitial, function (err, response) {
        if (err) {
          handler(err, null);
        } else {
          if (response.length === 0) {
            handler("No se ha encontrado el usuario: " + user, null);
          } else {
            if (response[0].VALUE === email) {
              const sqlSentence = `ALTER USER ${user} RESET CONNECT ATTEMPTS`;
              conn.exec(sqlSentence, function (err, resultData) {
                if (err) {
                  handler(err, null);
                } else {
                  var response = {
                    response: "Usuario Desbloqueado",
                    user: user,
                    email: email,
                  };
                  handler(null, response);
                }
              });
            } else {
              handler("Email incorrecto para el usuario: " + user, null);
            }
          }
        }
      });
    }
  });
}

module.exports = { validateUserDb, changePasswordModule, unlockUserModule };

// {
//   "USER_NAME": "HSOUZA",
//   "PARAMETER": "EMAIL ADDRESS",
//   "VALUE": "HSOUZA@valorem.com.co"
// }
