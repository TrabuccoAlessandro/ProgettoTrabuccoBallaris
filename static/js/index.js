"use strict"

$(()=>{
    $("#Login").hide();

    $("#tagLogin").on("click",function (){
        $("#Login").show();
    });

    $("#exitLog").on("click",function (){
        $("#Login").hide();
    })
});
