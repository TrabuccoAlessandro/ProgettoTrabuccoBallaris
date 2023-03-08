"use strict"
$(()=>{
    $("#Login").hide();


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
        let loginReq=sendRequestNoCallback("/api/login","POST",{username:user,pwd:password});
        loginReq.fail(function (jqXHR){
            $(".msg").html("Error login: " + jqXHR.status + " - " + jqXHR.responseText);
        });
        loginReq.done(function (serverData){
            serverData = JSON.parse(serverData);
            localStorage.setItem("token", serverData.token);
            serverData.Key = "";
            serverData.token = "";
            serverData = JSON.stringify(serverData);
            localStorage.setItem("user",serverData);
            window.location = "loginOk.html";
        });
    })
});
