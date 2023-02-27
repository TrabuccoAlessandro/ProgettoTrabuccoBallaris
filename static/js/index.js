"use strict"

$(()=>{
    $("#tagLogin").on("click",function (){
        let admin = sendRequestNoCallback("/api/Admin","GET",{});
        admin.fail(function (jqXHR) {
            error(jqXHR);
            alert("dio");
        });
        admin.done(function (serverData) {
            alert(serverData[0]._id);
        });
    });
});
