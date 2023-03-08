"use strict"
$(()=>{

    let userData = localStorage.getItem("user");
    userData = JSON.parse(userData);
    $("#userProfilo").html(userData.User);

});
