"use strict"
$(()=>{
    window.onbeforeunload = function(){
        Cookies.set("token","corrupted");
    }
})

