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
        let bodyHtml = "<html><body><br /><br /><h1>Dati del giocatore selezionato</h1>" +
            "<h3 style='font-weight: normal; font-size: 18pt; color:red'><table><tr><td width='250px'>Nome</td><td width='400px'>" + "</td></tr>" +
            "<tr><td width='250px'>Squadra</td><td width='400px'>" + "</td></tr>" +
            "<tr><td width='250px'>Punti</td><td width='400px'>" + cod + "</td></tr>" +
            "</table></h3>" +
            "<br><br><h2>Grazie per averci contattato. Il team della 5A info</h2></body></html>";
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