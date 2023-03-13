"use strict"
const mongoFunctions = require("./mongoFunctions");
const tokenAdministration = require("./tokenAdministration");
const fs = require('fs');
const HTTPS = require('https');
const nodemailer=require("nodemailer");
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { token } = require("./tokenAdministration");
const bcrypt = require("bcrypt");
// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate };

const TIMEOUT = 1000;
let port = 8888;

var httpsServer = HTTPS.createServer(credentials, app);
httpsServer.listen(port, '127.0.0.1', function () {
    console.log("Server running on port %s...", port);
});

// middleware
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", function (req, res, next) {
    console.log(">_ " + req.method + ": " + req.originalUrl);
    if (Object.keys(req.query).length != 0)
        console.log("Parametri GET: " + JSON.stringify(req.query));
    if (Object.keys(req.body).length != 0)
        console.log("Parametri BODY: " + JSON.stringify(req.body));
    next();
});

app.use("/", express.static('./static'));

app.post("/api/login", function (req, res) {
    let query = { User: req.body.username };
    console.log(query);
    mongoFunctions.findLogin(req, "prova", "Utenti", query, function (err, data) {
        if (err.codErr == -1) {
            console.log(data);
            tokenAdministration.createToken(data);
            data.token = tokenAdministration.token;
            res.send(data);
        }
        else{
            error(req, res, {code:err.codErr, message:err.message});
        }
    });
});

app.get("/api/getId", function (req, res) {
    mongoFunctions.conta( "prova", "Utenti", {}, function (err, data) {
        if (err.codErr == -1) {
            res.send(data.toString());
        }
        else{
            error(req, res, {code:err.codErr, message:err.message});
        }
    });
});

app.get("/api/ctrlSession", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = {_id:payload.id}
            mongoFunctions.findOne("prova","Utenti",query,function (err,data){
                data.Key = "";
                res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.post("/api/Registrazione",function (req,res){
let query = req.body;
query.Key = bcrypt.hashSync(query.Key,12);
console.log(query);
    mongoFunctions.insertOne("prova","Utenti",query,function (err,data){
        res.send(data);
    })
})

app.post("/api/ctrlUser", function (req, res) {
    let query = { User: req.body.username };
    console.log(query);
    mongoFunctions.findOne( "prova", "Utenti", query, function (err, data) {
        if (err.codErr == -1) {
            res.send(data);
        }
        else{
            error(req, res, {code:err.codErr, message:err.message});
        }
    });
});

app.post("/api/codiceVer",function (req,res){
        let mailDest = req.body.mail;
        let cod = req.body.cod;
        let pwd=require("./getPwd.js");
        let transport=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:"trabucco.ballaris.esame@gmail.com",
                pass:pwd
            }
        });
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
        let bodyHtml = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:v=\"urn:schemas-microsoft-com:vml\" lang=\"en\">\n" +
            "  \n" +
            "  <head><link rel=\"stylesheet\" type=\"text/css\" hs-webfonts=\"true\" href=\"https://fonts.googleapis.com/css?family=Lato|Lato:i,b,bi\">\n" +
            "    <title>Email template</title>\n" +
            "    <meta property=\"og:title\" content=\"Email template\">\n" +
            "    \n" +
            "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n" +
            "\n" +
            "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
            "\n" +
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    \n" +
            "    <style type=\"text/css\">\n" +
            "   \n" +
            "      a{ \n" +
            "        text-decoration: underline;\n" +
            "        color: inherit;\n" +
            "        font-weight: bold;\n" +
            "        color: #253342;\n" +
            "      }\n" +
            "      \n" +
            "      h1 {\n" +
            "        font-size: 56px;\n" +
            "      }\n" +
            "      \n" +
            "        h2{\n" +
            "        font-size: 28px;\n" +
            "        font-weight: 900; \n" +
            "      }\n" +
            "      \n" +
            "      p {\n" +
            "        font-weight: 100;\n" +
            "      }\n" +
            "      \n" +
            "      td {\n" +
            "    vertical-align: top;\n" +
            "      }\n" +
            "      \n" +
            "      #email {\n" +
            "        margin: auto;\n" +
            "        width: 600px;\n" +
            "        background-color: white;\n" +
            "      }\n" +
            "      \n" +
            "      button{\n" +
            "        font: inherit;\n" +
            "        background-color: #FF7A59;\n" +
            "        border: none;\n" +
            "        padding: 10px;\n" +
            "        text-transform: uppercase;\n" +
            "        letter-spacing: 2px;\n" +
            "        font-weight: 900; \n" +
            "        color: white;\n" +
            "        border-radius: 5px; \n" +
            "        box-shadow: 3px 3px #d94c53;\n" +
            "      }\n" +
            "      \n" +
            "      .subtle-link {\n" +
            "        font-size: 9px; \n" +
            "        text-transform:uppercase; \n" +
            "        letter-spacing: 1px;\n" +
            "        color: #CBD6E2;\n" +
            "      }\n" +
            "      \n" +
            "    </style>\n" +
            "    \n" +
            "  </head>\n" +
            "    \n" +
            "    <body bgcolor=\"#F5F8FA\" style=\"width: 100%; margin: auto 0; padding:0; font-family:Lato, sans-serif; font-size:18px; color:#33475B; word-break:break-word\">\n" +
            "  \n" +
            " <! View in Browser Link --> \n" +
            "      \n" +
            "<div id=\"email\">\n" +
            "      <table align=\"right\" role=\"presentation\">\n" +
            "        <tr>\n" +
            "          <td>\n" +
            "          <a class=\"subtle-link\" href=\"#\">View in Browser</a>\n" +
            "          </td>\n" +
            "          <tr>\n" +
            "      </table>\n" +
            "  \n" +
            "  \n" +
            "  <! Banner --> \n" +
            "         <table role=\"presentation\" width=\"100%\">\n" +
            "            <tr>\n" +
            "         \n" +
            "              <td bgcolor=\"#00A4BD\" align=\"center\" style=\"color: white;\">\n" +
            "            \n" +
            "             <img alt=\"Flower\" src=\"https://hs-8886753.f.hubspotemail.net/hs/hsstatic/TemplateAssets/static-1.60/img/hs_default_template_images/email_dnd_template_images/ThankYou-Flower.png\" width=\"400px\" align=\"middle\">\n" +
            "                \n" +
            "                <h1>Ecco il codice "+cod+" </h1>\n" +
            "                \n" +
            "              </td>\n" +
            "        </table>\n" +
            "  \n" +
            "  \n" +
            "  \n" +
            "  \n" +
            "    <! First Row --> \n" +
            "  \n" +
            "  <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"10px\" style=\"padding: 30px 30px 30px 60px;\">\n" +
            "     <tr>\n" +
            "       <td>\n" +
            "        <h2> Lorem ipsum dolor sit amet</h2>\n" +
            "            <p>\n" +
            "              Ut eget semper libero. Vestibulum non maximus nisl, ut iaculis ante. Nunc arcu elit, cursus eget urna et, tempus aliquam eros. Ut eget semper libero. Vestibulum non maximus nisl, ut iaculis ante. Nunc arcu elit, cursus eget urna et, tempus aliquam eros.  \n" +
            "            </p>\n" +
            "                <button> \n" +
            "                  Button 1\n" +
            "                </button>\n" +
            "          </td> \n" +
            "          </tr>\n" +
            "                 </table>\n" +
            "  \n" +
            "  <! Second Row with Two Columns--> \n" +
            "  \n" +
            "    <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"10px\" width=\"100%\" style=\"padding: 30px 30px 30px 60px;\">\n" +
            "      <tr>\n" +
            "          <td> \n" +
            "           <img alt=\"Blog\" src=\"https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_sample-illustration-3.svg\" width=\"200px\" align=\"middle\">\n" +
            "            \n" +
            "         <h2> Vivamus ac elit eget </h2>\n" +
            "            <p>\n" +
            "              Vivamus ac elit eget dolor placerat tristique et vulputate nibh. Sed in elementum nisl, quis mollis enim. Etiam gravida dui vel est euismod, at aliquam ipsum euismod. \n" +
            "      \n" +
            "              </p>\n" +
            "  \n" +
            "          </td>\n" +
            "        \n" +
            "          <td>\n" +
            "            \n" +
            "            <img alt=\"Shopping\" src=\"https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_sample-illustration-5.svg\" width=\"200px\" align=\"middle\">\n" +
            "         <h2> Suspendisse tincidunt iaculis </h2>\n" +
            "            <p>\n" +
            "              Suspendisse tincidunt iaculis fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras laoreet elit purus, quis pulvinar ipsum pulvinar et. \n" +
            "      \n" +
            "              </p> \n" +
            "          </td>\n" +
            "          </tr>\n" +
            "      \n" +
            "            <tr>\n" +
            "              <td> <button> Button 2 </button> </td> \n" +
            "              <td> <button> Button 3 </button> </td> \n" +
            "              \n" +
            "  </table>\n" +
            "     \n" +
            "        <! Banner Row --> \n" +
            "  <table role=\"presentation\" bgcolor=\"#EAF0F6\" width=\"100%\" style=\"margin-top: 50px;\" >\n" +
            "      <tr>\n" +
            "          <td align=\"center\" style=\"padding: 30px 30px;\">\n" +
            "            \n" +
            "         <h2> Nullam porta arcu </h2>\n" +
            "            <p>\n" +
            "              Nam vel lobortis lorem. Nunc facilisis mauris at elit pulvinar, malesuada condimentum erat vestibulum. Pellentesque eros tellus, finibus eget erat at, tempus rutrum justo. \n" +
            "      \n" +
            "              </p>\n" +
            "              <a href=\"#\"> Ask us a question</a>      \n" +
            "          </td>\n" +
            "          </tr>\n" +
            "      </table>\n" +
            "  \n" +
            "        <! Unsubscribe Footer --> \n" +
            "      \n" +
            "  <table role=\"presentation\" bgcolor=\"#F5F8FA\" width=\"100%\" >\n" +
            "      <tr>\n" +
            "          <td align=\"left\" style=\"padding: 30px 30px;\">\n" +
            "            <p style=\"color:#99ACC2\"> Made with &hearts; at HubSpot HQ </p>\n" +
            "              <a class=\"subtle-link\" href=\"#\"> Unsubscribe </a>      \n" +
            "          </td>\n" +
            "          </tr>\n" +
            "      </table> \n" +
            "      </div>\n" +
            "    </body>\n" +
            "      </html>";
        const message={
            from:"trabucco.ballaris.esame@gmail.com",
            to: mailDest,
            subject:"Codice Verifica",
            html:bodyHtml
        };
        transport.sendMail(message,function (err,info){
            if(err){
                console.log(err);
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=1;
                res.send("Errore di invio mail");
            }
            else{
                console.log(info);
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=1;
                res.send(JSON.stringify(info));
            }
        });
})



/* ************************************************************* */
function error(req, res, err) {
    res.status(err.code).send(err.message);
}

// default route finale
app.use('/', function (req, res, next) {
    res.status(404)
    fs.readFile("./static/error.html", function (err, content) {
        if (err)
            content = "<h1>Risorsa non trovata</h1>" +
                "<h2><a href='/'>Back to Home</a></h2>"
        let pageNotFound = content.toString();
        res.send(pageNotFound);
    });
});