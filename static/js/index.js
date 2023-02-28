"use strict"

$(()=>{
    $("#Login").hide();

    $("#tagLogin").on("click",function (){
        $("#Login").show();
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
        });
        login.done(function (serverdata){
            console.log(serverdata);
        })
    })
});
