"use strict";
const dbModule = require("../db/connection");

function validateLogin(req, res) {
  dbModule.validateUserDb(
    req.body.user,
    req.body.password,
    (error, response) => {
      if (error) {
        return res.status(404).send({ error });
      } else {
        return res.status(200).send(response);
      }
    }
  );
}

function changePassword(req, res) {
  dbModule.changePasswordModule(
    req.body.user,
    req.body.password,
    req.body.newPassword,
    req.body.checkKoba,
    (error, response) => {
      if (error) {
        return res.status(404).send({ error });
      } else {
        return res.status(200).send({ response });
      }
    }
  );
}

function unlockUser(req, res) {
  dbModule.unlockUserModule(
    req.body.user,
    req.body.email,
    req.body.checkKoba,
    (error, response) => {
      if (error) {
        return res.status(404).send({ error });
      } else {
        return res.status(200).send({ response });
      }
    }
  );
}

module.exports = { validateLogin, changePassword, unlockUser };
