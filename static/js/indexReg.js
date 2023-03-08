"use strict"
$(()=>{
    $("#verifica").hide();

    document.getElementById("btnIndietro").addEventListener("click", function () {
        $("#registra").show();
        $("#verifica").hide();
    });

    document.getElementById("btnAnnulla").addEventListener("click", function (){
       window.location = "index.html";
    });

    document.getElementById("btnRegistra").addEventListener("click",function (){
        let user = $("#txtUser").val();
        let ctrlUser = sendRequestNoCallback("/api/ctrlUser","POST",{username:user})
        ctrlUser.fail(function (jqXHR){
            alert("Errore");
        });
        ctrlUser.done(function (serverData){
            if(serverData == "")
                alert("user non esistente");
            else
                alert("user esistente");
        });

        $("#registra").hide();
        $("#verifica").show();
    })

    document.getElementById("btnVerifica").addEventListener("click", function (){
        alert("GG");
    })

});