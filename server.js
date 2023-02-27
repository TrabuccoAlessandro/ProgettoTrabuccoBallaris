"use strict";

const fs = require("fs");
const dispatcher = require("./dispatcher");
const http = require("http");

let header = { "Content-Type": "text/html;charset=utf-8" };
let headerJSON = { "Content-Type": "application/json;charset=utf-8" };
const jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync("keys/private.key", "UTF8");
const mongo = require("mongodb");
const bcrypt = require("bcrypt");
const mongoClient = mongo.MongoClient;
const CONNECTION_STRING = "mongodb+srv://db1:prova123@cluster0.rzrtnub.mongodb.net/?retryWrites=true&w=majority";
const CONNECTION_OPTIONS = { useNewUrlParser: true };
const tokenAdministration = require("./tokenAdministration");
const { readCookie, payload } = require("./tokenAdministration");


dispatcher.addListener("GET","/api/Admin", function(req,res) {

    let mongoConnection=mongoClient.connect(CONNECTION_STRING);
    mongoConnection.catch((err)=>{
        console.log(err);
        error(req,res,{"code":503,"message":"Server Mongo Error"});
    });
    mongoConnection.then((client)=> {
        let db = client.db("prova");
        let collection = db.collection("Utenti");
        collection.find({_id:1}).toArray(function (errQ,data){
            if(errQ)
                error(req,res,{"code":500,"message":"Errore durante Query Mongo"});
            else{
                res.end(JSON.stringify(data));
            }
            client.close()
        });
    });
});




function error(req, res, err) {
    res.writeHead(err.code, header);
    res.end(err.message);
}

//Creazione del server
http
    .createServer(function (req, res) {
        dispatcher.dispatch(req, res);
    })
    .listen(8888);
dispatcher.showList();
console.log("Server running on port 8888...");