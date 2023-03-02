"use strict"
$(()=>{
    $("#Login").hide();
    $("#profile").hide();
    $("#registrazione").hide();

    let ricacarica = false;
    let controlloSessione = sendRequestNoCallback("/api/ctrlCookie", "GET")
    controlloSessione.fail(function(jqXHR){
        error(jqXHR)
    })
    controlloSessione.done(function(serverData){
        caricaProfilo(serverData);
            ricacarica = true;
    })


    $("#tagLogin").on("click",function (){
        if ($("#tagLogin").html() == "Login")
        {
            $("#Login").show();
            $("#labelLog").html("");
        }
        else if ($("#tagLogin").html() == "Logout")
        {
            // Logout
            Cookies.set("token", "corrupted");
            window.location = "index.html";
            $("#tagLogin").html("Login");
            $("#intro").show();
            $("#profile").hide();
        }
    });

    $("#exitLog").on("click",function (){
        $("#Login").hide();
    })

    $("#signIn").on("click",function (){
        let username = $("#userLo").val();
        let password = $("#pwdLo").val();
        let login = sendRequestNoCallback("/api/Login","POST",{username:username,pwd:password});
        login.fail(function (jqXHR) {
            error(jqXHR);
            $("#labelLog").html("CREDENZIALI ERRATE");
        });
        login.done(function (serverdata){
            window.location = "loginOk.html";
            caricaProfilo(serverdata);
        })
    })

    function caricaProfilo(serverdata){
        $("#tagLogin").html("Logout");
        $("#Login").hide();
        $("#intro").hide();
        $("#profile").show();
        $("#userLo").val("");
        $("#pwdLo").val("");
        $("#cognomeProfilo").html(serverdata.Cognome);
        $("#nomeProfilo").html(serverdata.Nome);
        $("#dataProfilo").html(serverdata.DataNascita);
        $("#mailProfilo").html(serverdata.Mail);
        $("#userProfilo").html(serverdata.User);
    }
});
