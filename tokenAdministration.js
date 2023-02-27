const jwt = require("jsonwebtoken");
const fs = require("fs");

let tokenAdministration = function () {
  this.payload = "";
  this.token = "";
  this.valoreCookie = "";
  this.privateKey = fs.readFileSync("keys/private.key", "UTF8");
};

tokenAdministration.prototype.ctrlToken = function (req, callback) {
  this.payload = "";
  this.token = this.readCookie(req, "token");
  let errToken = { codeErr: -1, message: "" };
  if (this.token == "")
    errToken = { codeErr: 403, message: "Token inesistente" };
  else {
    try {
      this.payload = jwt.verify(this.token, this.privateKey);
      console.log("Token OK!");
    } catch (err) {
      errToken = { codeErr: 403, message: "Token scaduto o compromesso" };
    }
  }
  callback(errToken);
};

tokenAdministration.prototype.createToken = function (user) {
  this.token = jwt.sign(
    {
      reparto: user.reparto,
      medico: user.medico,
      paziente: user.paziente,
      user: user.user,
      ricoveri: user.ricoveri,
      medicinali: user.medicinali,
      admin: user.admin,
      exp: Math.floor(Date.now() / 1000 + 10),
    },
    this.privateKey
  );
  console.log("Creato nuovo token: " + this.token);
};

tokenAdministration.prototype.readCookie = function (req, nome) {
  this.valoreCookie = "";
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      cookies[i] = cookies[i].split("=");
      if (cookies[i][0] == nome) {
        this.valoreCookie = cookies[i][1];
        break;
      }
    }
  }
  return this.valoreCookie;
};

module.exports = new tokenAdministration();
