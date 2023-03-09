"use strict"
$(()=>{
    $("#verifica").hide();
    let userDaReg = {};
    let number;
    document.getElementById("btnIndietro").addEventListener("click", function () {
        $("#registra").show();
        $("#verifica").hide();
    });

    document.getElementById("btnAnnulla").addEventListener("click", function (){
       window.location = "index.html";
    });

    document.getElementById("btnRegistra").addEventListener("click",function (){
        let user = $("#txtUser").val();
        if (user != "")
        {
            let ctrlUser = sendRequestNoCallback("/api/ctrlUser","POST",{username:user})
            ctrlUser.fail(function (jqXHR){
                alert("Errore");
            });
            ctrlUser.done(function (serverData){
                if(serverData == "" && $("#txtMail").val() != "" && $("#txtCognome").val()!="" && $("#txtNome").val()!="" && $("#txtPassword").val()!=""&& $("#txtData").val()!="")
                {
                    let id = sendRequestNoCallback("/api/getId","GET",{});
                    id.fail(function (jqXHR) {
                        error(jqXHR);
                    });
                    id.done(function (serverData){
                        serverData = JSON.parse(serverData);
                        let id = parseInt(serverData) +1;
                        console.log(id);
                    });
                    userDaReg._id = id;
                    userDaReg.Nome = $("#txtNome").val();
                    userDaReg.Cognome = $("#txtCognome").val();
                    userDaReg.DataNascita = $("#txtData").val();
                    userDaReg.Admin = false;
                    userDaReg.Mail = $("#txtMail").val();
                    userDaReg.User = $("#txtUser").val();
                    userDaReg.Key = $("#txtPassword").val();
                    number = Math.round(Math.random () * 1000000);
                    let verificaCodice = sendRequestNoCallback("/api/codiceVer","POST",{cod:number,mail:userDaReg.Mail});
                    verificaCodice.fail(function (jqXHR) {
                        error(jqXHR);
                    });
                    verificaCodice.done(function (serverData){
                        console.log(serverData);
                    });

                    $("#registra").hide();
                    $("#verifica").show();
                }
                else
                    alert("Inserisci TUTTI I CAMPI");
            });
        }
        else
            alert("Inserisci tutti i campi");


    })

    document.getElementById("btnVerifica").addEventListener("click", function (){
        if(number.toString() == $("#txtCodice").val() )
        {
            let insert = sendRequestNoCallback("/api/Registrazione","POST",userDaReg);
            insert.fail(function (jqXHR) {
                error(jqXHR);
            });
            insert.done(function (serverData){
                window.location = "index.html";

            });

        }
        else
            alert("CODICE ERRATO");
    })

});