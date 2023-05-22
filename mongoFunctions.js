"use strict";

const mongo=require("mongodb");
const bcrypt=require("bcrypt");
const mongoClient=mongo.MongoClient;
const CONNECTION_STRING = "mongodb+srv://db1:prova123@cluster0.rzrtnub.mongodb.net/?retryWrites=true&w=majority";
const CONNECION_OPTIONS={ useNewUrlParser:true };

let mongoFunctions = function () {}

function setConnection(nomeDb,col,callback){
    let errConn={codErr:-1,message:""};
    let mongoConnection=mongoClient.connect(CONNECTION_STRING);
    mongoConnection.catch((err)=>{
        console.log("Errore di connessione al server Mongo. "+err);
        errConn.codErr=503;
        errConn.message="Errore di connessione al server Mongo.";
        callback(errConn,null,null);
    });
    mongoConnection.then((client)=>{
        let db=client.db(nomeDb);
        callback(errConn,db.collection(col),client);
    });
}

mongoFunctions.prototype.findOne=function (nomeDb,collection,query,callback){
    setConnection(nomeDb,collection,function (errConn,coll,client) {
        if(errConn.codErr==-1){
            coll.findOne(query,function (errQ,data){
                client.close();
                let errQuery={codErr:-1,message:""};
                if(!errQ)
                    callback(errQuery,data);
                else{
                    errQuery.codErr=500;
                    errQuery.message="Errore durante l'esecuzione della query su mongo";
                    callback(errQuery,{});
                }
            });
        }else
            callback(errConn,{});
    });
}
mongoFunctions.prototype.conta=function (nomeDb,collection,query,callback){
    setConnection(nomeDb,collection,function (errConn,coll,client) {
        if(errConn.codErr==-1){
            coll.count(query,function (errQ,data){
                client.close();
                let errQuery={codErr:-1,message:""};
                if(!errQ)
                    callback(errQuery,data);
                else{
                    errQuery.codErr=500;
                    errQuery.message="Errore durante l'esecuzione della query su mongo";
                    callback(errQuery,{});
                }
            });
        }else
            callback(errConn,{});
    });
}

mongoFunctions.prototype.conta2 = function(req,nomedb,collection,query,callback){
    setConnection(nomedb,collection,function (errConn,coll,client) {
        console.log(errConn);
        if(errConn.codErr==-1){ // no error
            getMaxValueFromCollection(client,nomedb)
                .then((maxValue) => {
                    // Gestisci il valore massimo restituito
                    callback(errConn,{id:maxValue})
                });
        }
        else
            callback(errConn,{});
    });
}

function getMaxValueFromCollection(client,dbName) {

    // Connessione al client MongoDB
    return client.connect()
        .then(() => {
            console.log('Connessione al database avvenuta con successo');

            // Seleziona il database
            const db = client.db(dbName);

            // Seleziona la collezione
            const collection = db.collection('Prenotazioni');

            // Esegui la query per ottenere il valore massimo
            return collection.aggregate([
                { $group: { _id: null, maxValue: { $max: '$_id' } } }
            ]).toArray();
        })
        .then((result) => {
            if (result.length > 0) {
                const maxValue = result[0].maxValue;
                console.log('Valore massimo:', maxValue);
                return maxValue;
            } else {
                console.log('La collezione è vuota');
                return null;
            }
        })
        .catch((error) => {
            console.error('Errore durante l\'esecuzione della query:', error);
            return null;
        })
        .finally(() => {
            // Chiudi la connessione al database
            client.close();
            console.log('Connessione chiusa');
        });
}


mongoFunctions.prototype.find=function (nomeDb,collection,query,callback){
    setConnection(nomeDb,collection,function (errConn,coll,client) {
        if(errConn.codErr==-1){
            coll.find(query).toArray(function (errQ,data){
                client.close();
                if(!errQ)
                    callback({codErr:-1,message:""},data);
                else
                    callback({codErr:500,message:"Errore durante l'esecuzione della query"}, {});
            });
        }else
            callback(errConn,{});
    });
}

mongoFunctions.prototype.updateOne = function (nomeDb, collection, query, update, callback) {
    setConnection(nomeDb, collection, function (errConn, coll, client) {
        if (errConn.codErr == -1) {
            coll.updateOne(query, {$set: update}, function (errQ, result) {
                client.close();
                if (!errQ)
                    callback({codErr: -1, message: ""}, result);
                else
                    callback({codErr: 500, message: "Errore durante l'esecuzione della query"}, {});
            });
        } else {
            callback(errConn, {});
        }
    });
}


mongoFunctions.prototype.findLogin = function(req,nomedb,collection,query,callback){
    setConnection(nomedb,collection,function (errConn,coll,client) {
        console.log(errConn);
        if(errConn.codErr==-1){ // no error
            console.log("CONNECTED!!!!!!!");
            let loginUser=coll.findOne(query);

            loginUser.then(function (data){
                let errData;
                if(data==null)
                    errData={codErr:401,message:"Errore di login. Username inesistente"}
                else{
                    if(bcrypt.compareSync(req.body.pwd,data.Key))
                        errData={codErr:-1,message:""}     // login ok
                    else
                        errData={codErr:401,message:"Errore di login. Password errata"}
                }
                callback(errData,data);
            });
            loginUser.catch(function (err){
                callback({codErr:500,message:"Errore durante l'esecuzione della query"},{});

            });
            loginUser.finally(function (){
                client.close();
                console.log("client close");
            });
        }
        else
            callback(errConn,{});
    });
}

mongoFunctions.prototype.insertOne = function (nomeDb, collection, query, callback){
    setConnection(nomeDb, collection, function (errConn,collection,conn){
        if(errConn.codErr==-1){
            collection.insertOne(query, function(errQ,data) {
                let errQuery;
                if(!errQ){
                    errQuery={codErr:-1, message:""};
                }else
                    errQuery={codErr:500, message:"Errore durante l'esecuzione della query"};
                conn.close();
                callback(errQuery);
            });
        }
        else
            callback(errConn);
    });
}

mongoFunctions.prototype.deleteOne = function (nomeDb, collection, query, callback){
    setConnection(nomeDb, collection, function (errConn,collection,conn){
        if(errConn.codErr==-1){
            collection.deleteOne(query, function(errQ,data) {
                let errQuery;
                if(!errQ){
                    errQuery={codErr:-1, message:""};
                }else
                    errQuery={codErr:500, message:"Errore durante l'esecuzione della query"};
                conn.close();
                callback(errQuery);
            });
        }
        else
            callback(errConn);
    });
}

module.exports = new mongoFunctions();