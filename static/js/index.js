"use strict"

$(()=>{
    $("#Login").hide();
    $("#profile").hide();

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
            $("#tagLogin").html("Logout");
            $("#Login").hide();
            $("#intro").hide();
            $("#profile").show();
            $("#userLo").val("");
            $("#pwdLo").val("");
            console.log(serverdata);
            $("#cognomeProfilo").html(serverdata.Cognome);
            $("#nomeProfilo").html(serverdata.Nome);
            $("#dataProfilo").html(serverdata.DataNascita);
            $("#mailProfilo").html(serverdata.Mail);
            $("#userProfilo").html(serverdata.User);
        })
    })
});
