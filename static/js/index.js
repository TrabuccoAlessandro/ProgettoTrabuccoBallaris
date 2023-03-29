"use strict"
$(()=>{
    $("#Login").hide();
    //$("#wrapper").hide();
    localStorage.setItem("token", "corrupted");

    document.getElementById("tagLogin").addEventListener("click",function (){
        if ($("#tagLogin").html() == "Login")
        {
            $("#Login").show();
            $("#labelLog").html("");
        }
        else if ($("#tagLogin").html() == "Logout")
        {
            // Logout
            localStorage.setItem("token", "corrupted");
            window.location.href = "index.html";
            $("#tagLogin").html("Login");
            $("#intro").show();
            $("#profile").hide();
        }
    });

     document.getElementById("exitLog").addEventListener("click",function (){
    $("#Login").hide();
})

    document.getElementById("signIn").addEventListener("click",function (){
        let user = $("#userLo").val();
        let password = $("#pwdLo").val();
        $("#labelLog").html("");
        //$("#wrapper").show();
        let loginReq=sendRequestNoCallback("/api/login","POST",{username:user,pwd:password});
        loginReq.done(function (serverData){
            serverData = JSON.parse(serverData);
            localStorage.setItem("token", serverData.token);
            serverData.Key = "";
            serverData.token = "";
            serverData = JSON.stringify(serverData);
            window.location = "loginOk.html";
        });
        loginReq.fail(function (jqXHR){
            $("#labelLog").html("ERRORE LOGIN");
        });
    })

    document.getElementById("btnSignUp").addEventListener("click",function (){
        window.location = "signUp.html";
    })
});
