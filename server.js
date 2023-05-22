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
const pwd = require("./getPwd");
// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate };

const TIMEOUT = 1000;
let port = 8888;
const pwd2=require("./getPwd.js");

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
            console.log(err);
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


app.get("/api/getIdPren", function (req, res) {
    mongoFunctions.conta2( req,"prova", "Prenotazioni", {}, function (err, data) {
        if (err.codErr == -1) {
            console.log("++++");
            console.log(data);
            res.send(data);
        }
        else{
            error(req, res, {code:err.codErr, message:err.message});
        }
    });
});


app.get("/api/getIdCampo", function (req, res) {
    mongoFunctions.conta( "prova", "campi", {}, function (err, data) {
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

app.get("/api/Prenotazioni", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = {idPrenotante:payload.id}
            mongoFunctions.find("prova","Prenotazioni",query,function (err,data){
                res.send(data);
                console.log(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.get("/api/visualCampi", function (req, res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = {}
            mongoFunctions.find("prova","campi",query,function (err,data){
                res.send(data);
                console.log(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            
            error(req, res, { code: 403, message: payload.message });
        }
    });
});

app.post("/api/prezzoCampo",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = req.body;
            console.log(query);
            mongoFunctions.findOne("prova","campi",query,function (err,data){
                res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
})
app.post("/api/infoPren",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = req.body;
            console.log(query);
            mongoFunctions.findOne("prova","Prenotazioni",query,function (err,data){
                res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
})

app.post("/api/infoCamp",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = req.body;
            console.log(query);
            mongoFunctions.findOne("prova","campi",query,function (err,data){
                res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
})
app.post("/api/eliminaPren",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = req.body;
            console.log(query);
            mongoFunctions.deleteOne("prova","Prenotazioni",query,function (err,data){
                res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
})


app.post("/api/nuovoCampo",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = req.body;
            console.log(query);
            mongoFunctions.insertOne("prova","campi",query,function (err,data){
                res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
})

app.post("/api/Registrazione",function (req,res){
let query = req.body;
query.Key = bcrypt.hashSync(query.Key,12);
console.log(query);
    mongoFunctions.insertOne("prova","Utenti",query,function (err,data){
        res.send(data);
    })
})
app.post("/api/Prenota",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let query = req.body;
            console.log(query);

            query.DataPrenotazione = new Date (req.body.DataPrenotazione);
            query.DataPrenotazione.setHours(query.DataPrenotazione.getHours()+2);
            query.DataFine = new Date (req.body.DataFine);
            query.DataFine.setHours(query.DataFine.getHours()+2);
            if(query.DataPrenotazione<query.DataFine)
            {
                mongoFunctions.insertOne("prova","Prenotazioni", query,function (err,data){
                    res.send(data);
                    console.log(data);
                });
             }
            else{
                error(req,res,{code: 403, message: "Inserimento orario errato"});
            }
            
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
    })

app.post("/api/campiUpdate", function (req,res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let update = req.body;
            let query={_id:update._id};
            console.log(update._id);
            mongoFunctions.updateOne("prova", "campi", query,update, function (err, data) {
                res.send(data);
                console.log(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, {code: 403, message: payload.message});
        }
    })
});


app.post("/api/PrenUpdate", function (req,res) {
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let update = req.body;
            let query={_id:update._id};
            console.log(update._id);
            mongoFunctions.updateOne("prova", "Prenotazioni", query,update, function (err, data) {
                res.send(data);
                console.log(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, {code: 403, message: payload.message});
        }
    })
});


app.post("/api/ctrlPrenotazione",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function (payload) {
        if (!payload.err_exp) {
            let obj = req.body;
            let giorno = obj.DataPrenotazione.split(' ')[0];
            let inizio = new Date(obj.DataPrenotazione);
            inizio.setHours(inizio.getHours()+2);
            let fine = new Date(obj.DataFine);
            fine.setHours(fine.getHours()+2);
            let query = {$and:[{Giorno: giorno},{idCampo:obj.idCampo},{$or:[{$and: [{DataPrenotazione :{$gt:inizio}},{DataPrenotazione :{$lt:fine}}]}, {DataPrenotazione: inizio}]}]};
            console.log(query);
            mongoFunctions.find("prova","Prenotazioni",query,function (err,data){
                if(data == "")
                    res.send("vuoto");
                else
                    res.send(data);
            })
        } else {  // Token inesistente o scaduto
            console.log(payload.message);
            error(req, res, { code: 403, message: payload.message });
        }
    });
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
        let transport=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:"trabucco.ballaris.esame@gmail.com",
                pass:pwd2
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
            "  <! Banner --> \n" +
            "         <table role=\"presentation\" width=\"100%\">\n" +
            "            <tr>\n" +
            "         \n" +
            "              <td bgcolor=\"#20b2aa\" align=\"center\" style=\"color: white;\">\n" +
            "            \n" +
            "             <img src=\"static/img/logo.png\" width=\"400px\" align=\"middle\">\n" +
            "                \n" +
            "                <h1>Ecco il codice di verifica "+cod+" </h1>\n" +
            "                \n" +
            "              </td>\n" +
            "        </table>\n" +
            "        <! Unsubscribe Footer --> \n" +
            "      \n" +
            "  <table role=\"presentation\" bgcolor=\"#F5F8FA\" width=\"100%\" >\n" +
            "      <tr>\n" +
            "          <td align=\"left\" style=\"padding: 30px 30px;\">\n" +
            "            <p style=\"color:#99ACC2\"> CREATE BY TRABUCCO-BALLARIS </p>\n" +
            "              <a class=\"subtle-link\" href=\"#\"> SMASHSPHERE</a>      \n" +
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

app.post("/api/mailPrenot",function (req,res){

    let mailDest = req.body.mail;
    let oraInizio = req.body.prenotazione.DataPrenotazione.toString();
    oraInizio = oraInizio.split(' ')[1];
    let oraFine = req.body.prenotazione.DataFine.toString();
    oraFine = oraFine.split(' ')[1];
    let transport=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"trabucco.ballaris.esame@gmail.com",
            pass:pwd2
        }
    });
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
    let bodyHtml = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "  <meta charset=\"UTF-8\">\n" +
        "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "  <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap\" rel=\"stylesheet\">\n" +
        "  <style>\n" +
        "    /* Stili CSS per l'email */\n" +
        "    body {\n" +
        "      background-color: #f4f7fa;\n" +
        "      font-family: 'Montserrat', Arial, sans-serif;\n" +
        "      margin: 0;\n" +
        "      padding: 0;\n" +
        "    }\n" +
        "\n" +
        "    .header {\n" +
        "      background-color: #0080ff;\n" +
        "      padding: 20px;\n" +
        "      text-align: center;\n" +
        "      color: #ffffff;\n" +
        "    }\n" +
        "\n" +
        "    .header h1 {\n" +
        "      margin: 0;\n" +
        "      font-size: 24px;\n" +
        "      font-weight: 700;\n" +
        "    }\n" +
        "\n" +
        "    .content {\n" +
        "      max-width: 600px;\n" +
        "      margin: 20px auto;\n" +
        "      padding: 20px;\n" +
        "      background-color: #ffffff;\n" +
        "      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);\n" +
        "      border-radius: 4px;\n" +
        "    }\n" +
        "\n" +
        "    .content h2 {\n" +
        "      font-size: 20px;\n" +
        "      font-weight: 700;\n" +
        "      margin-top: 0;\n" +
        "    }\n" +
        "\n" +
        "    .content p {\n" +
        "      font-size: 16px;\n" +
        "      line-height: 1.5;\n" +
        "      margin-bottom: 20px;\n" +
        "    }\n" +
        "\n" +
        "    .content .highlight {\n" +
        "      font-weight: 700;\n" +
        "    }\n" +
        "\n" +
        "    .content .button {\n" +
        "      display: inline-block;\n" +
        "      padding: 10px 20px;\n" +
        "      background-color: #0080ff;\n" +
        "      color: #ffffff;\n" +
        "      text-decoration: none;\n" +
        "      border-radius: 4px;\n" +
        "      transition: background-color 0.3s ease;\n" +
        "    }\n" +
        "\n" +
        "    .content .button:hover {\n" +
        "      background-color: #0059b3;\n" +
        "    }\n" +
        "\n" +
        "    .footer {\n" +
        "      text-align: center;\n" +
        "      color: #999999;\n" +
        "      margin-top: 40px;\n" +
        "      padding: 20px;\n" +
        "    }\n" +
        "  </style>\n" +
        "</head>\n" +
        "<body>\n" +
        "  <div class=\"header\">\n" +
        "    <h1>Tennis Court Reservation Confirmation</h1>\n" +
        "  </div>\n" +
        "  <div class=\"content\">\n" +
        "    <h2>Dear "+req.body.nome+" "+req.body.cognome +",</h2>\n" +
        "    <p>Your reservation for the tennis court on "+req.body.prenotazione.Giorno+" has been confirmed.</p>\n" +
        "    <p>\n" +
        "      <span class=\"highlight\">Reservation Details:</span><br>\n" +
        "      START: "+oraInizio+"<br>\n" +
        "      END: "+oraFine+"<br>\n" +
        "      PRICE: €"+req.body.prenotazione.Prezzo+" "+
        "    </p>\n" +
        "    <p>\n" +
        "      Please make sure to arrive at least 15 minutes before your scheduled time. If you need to cancel or reschedule your reservation, please do so at least 24 hours in advance. <br> you can pay online on our web site or at the desk \n" +
        "    </p>\n" +
        "    <p>\n" +
        "      If you have any questions or need further assistance, please don't hesitate to contact us.\n" +
        "    </p>\n" +
        "    <p>\n" +
        "      Thank you for choosing our tennis facilities. We hope you have a great time on the court!\n" +
        "    </p>\n" +
        "    <p>\n" +
        "    </p>\n" +
        "  </div>\n" +
        "  <div class=\"footer\">\n" +
        "    © 2023 SMASHSPHERE. All\n";

    const message={
        from:"trabucco.ballaris.esame@gmail.com",
        to: mailDest,
        subject:"RESOCONTO PRENOTAZIONE SMASHSPHERE",
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


app.post("/api/mailPay",function (req,res){

    let mailDest = req.body.mail;

    let transport=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"trabucco.ballaris.esame@gmail.com",
            pass:pwd2
        }
    });
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
    let bodyHtml = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "  <meta charset=\"UTF-8\">\n" +
        "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "  <style>\n" +
        "    /* Stili CSS per l'email */\n" +
        "    body {\n" +
        "      background-color: #f4f7fa;\n" +
        "      font-family: Arial, sans-serif;\n" +
        "    }\n" +
        "\n" +
        "    .container {\n" +
        "      max-width: 600px;\n" +
        "      margin: 0 auto;\n" +
        "      padding: 20px;\n" +
        "      background-color: #ffffff;\n" +
        "      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);\n" +
        "    }\n" +
        "\n" +
        "    h1 {\n" +
        "      color: #0080ff;\n" +
        "    }\n" +
        "\n" +
        "    p {\n" +
        "      color: #333333;\n" +
        "      line-height: 1.5;\n" +
        "    }\n" +
        "\n" +
        "    a {\n" +
        "      color: #0080ff;\n" +
        "      text-decoration: none;\n" +
        "    }\n" +
        "\n" +
        "    .button {\n" +
        "      display: inline-block;\n" +
        "      padding: 10px 20px;\n" +
        "      background-color: #0080ff;\n" +
        "      color: #ffffff;\n" +
        "      text-decoration: none;\n" +
        "      border-radius: 4px;\n" +
        "    }\n" +
        "\n" +
        "    .footer {\n" +
        "      margin-top: 30px;\n" +
        "      text-align: center;\n" +
        "      color: #999999;\n" +
        "    }\n" +
        "  </style>\n" +
        "</head>\n" +
        "<body>\n" +
        "  <div class=\"container\">\n" +
        "    <h1>CONFERMA DEL PAGAMENTO PER LA PRENOTAZIONE N° "+req.body.transazione+"</h1>\n" +
        "    <p>\n" +
        "      Grazie per aver prenotato con noi. Siamo felici che fai parte del nostro team!\n" +
        "    </p>\n" +
        "    <p>\n" +
        "      <h3>RESOCONTO</h3>" +
        "      <ul><li>"+req.body.proprietario+"</li><li>"+req.body.carta+"</li><li>"+req.body.costo+" €</li></ul>" +
        "    </p>\n" +
        "    <p>\n" +
        "      If you have any questions, feel free to <a href=\"trabucco.ballaris.esame@gmail.com\">contact us</a>. We'd be happy to assist you.\n" +
        "    </p>\n" +
        "    <div class=\"footer\">\n" +
        "      © 2023 SMASHSPHERE. All rights reserved.\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</body>\n" +
        "</html>\n";
    const message={
        from:"trabucco.ballaris.esame@gmail.com",
        to: mailDest,
        subject:"CONFERMA PAGAMENTO",
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