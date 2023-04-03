"use strict"
$(()=>{
    let wrapper=$("<center><div id='wrapper' class='col-12'>"+
        "<div class='circle'></div>"+
        "<div class='circle'></div>"+
        "<div class='circle'></div>"+
        "<div class='shadow'></div>"+
        "<div class='shadow'></div>"+
        "<div class='shadow'></div>"+
        "</div> </center>");
    $("#body").append(wrapper);
    $("#contenitore").hide();
    $("#footer").hide();
    $("#prenota").hide();
    $("#divCampi").hide();
    $("#ContCampi").hide();
    $("#campi").hide();
    $("#prenotazioni").hide();
    setTimeout(function() {
        $("#footer").show();
        $("#prenota").show();
        $("#divCampi").show();
        $("#ContCampi").show();
        $("#prenotazioni").show();
        $("#campi").show();
        $("#contenitore").fadeIn();
        wrapper.hide();
    }, 5000);
    if(localStorage.getItem("token") !="corrupted")
    {
        let tokenPreso = localStorage.getItem("token");
        let payload = parseJwt(tokenPreso);
        let controlloSessione = sendRequestNoCallback("/api/ctrlSession","GET",{});
        controlloSessione.fail(function (jqXHR){
            error(jqXHR);
            modal();
        });
        controlloSessione.done(function (serverData){
            let visualCampi=sendRequestNoCallback("/api/visualCampi","GET",{});
            visualCampi.fail(function(jqXHR){
                error(jqXHR);
            });
            visualCampi.done(function(serverData){
                caricaCampi(JSON.parse(serverData));
            })
        });

    }
    document.getElementById("tagLogin").addEventListener("click",function (){
        // Logout
        localStorage.setItem("token", "corrupted");
        localStorage.setItem("user",null);
        window.location.href = "index.html";
    });
    document.getElementById("btnIndietro").addEventListener("click",function (){
        window.location.href = "loginOk.html";
    });


    function modal (){
        localStorage.setItem("token", "corrupted");
        $("#ModalErrore").modal("show");
        $("#exampleModalLabel").html("ATTENZIONE!!");
        $("#modalBody").html("TOKEN SCADUTO O CORROTTO!!");
        $("#ModalErrore").on("hidden.bs.modal", function(){
            window.location.href = "index.html";
        });
        $("#modalClose").on("click", function(){
            window.location.href = "index.html";
        });
    }
    function caricaCampi(serverData)
    {
        console.log(serverData);

        for (let i=0;i<serverData.length;i++)
        {
            let divCampi=$("<div class='flip-card' id='divCampi"+i+"' data-aos='fade-left'>"+
                "<div class='flip-card-inner'>"+
                "<div class='flip-card-front'>"+
                "<p class='titleCampi'></p>"+
                "</div>"+
                "<div class='flip-card-back'>"+
                "<p class='titleCampi'>CARATTERISTICHE</p>"+
                "<p id='idTipologia"+i+"'></p>"+
                "<p id='idPrezzo"+i+"'></p>"+
                "<p id='idCittà"+i+"'></p>"+
                "<center><button class='btn btn-collapse btnPrenota' type='button' id='btnPrenota"+i+"' data-toggle='collapse' data-target='#collapseExample"+i+"' aria-expanded='false' aria-controls='collapseExample"+i+"'>MODIFICA</button></center>"+
                "<div class='collapse' id='collapseExample"+i+"'>"+
                "<div class='card card-body'>"+
                    "<form id='prenota' class='form' data-aos='fade-left'>"+
                    "<select id='selectTipo"+i+"' class='form-select' aria-label='Select'>"+
                    "<option class='input' selected value='Terra'>Terra</option>"+
                    "<option class='input' value='Sintetico'>Sintetico</option>"+
                    "<option class='input' value='Palestra'>Palestra</option>"+
                    "</select>"+
                    "<input class='input' id='txtPrezzo"+i+"' placeholder='15' value='15' type='text' disabled>"+ 
                    "<input class='input' id='txtCittà"+i+"' placeholder='Città' type='text' required=''> "+
                    "<input class='input' id='txtPosizione"+i+"' placeholder='Via' type='text' required=''>"+
                    "<select id='selectQualita"+i+"' class='form-select' aria-label='Select'>"+
                    "<option class='input' selected value='Bronze'>Bronze</option>"+
                    "<option class='input' value='Silver'>Silver</option>"+
                    "<option class='input' value='Gold'>Gold</option>"+
                    "</select>"+
                    "<input class='input' id='txtFine"+i+"' placeholder='' type='time' required=''>"+
                    "<button class='btn btn-primary' id='btnInviaPren"+i+"'>Invia</button"+
                    "</form>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>");
            $("#ContCampi").append(divCampi);
            $("#idTipologia"+i).html("Tipologia: "+serverData[i].Tipologia);
            $("#idPrezzo"+i).html("Prezzo ad ora: "+serverData[i].PrezzoOrario+" €");
            $("#idCittà"+i).html("Città: "+serverData[i].Città);
            let cont=0;
            document.getElementById("btnPrenota"+i).addEventListener("click",function (){
                cont++;
                if(cont==1){
                    $("#divCampi"+i).height(700);
                    $("#divCampi"+i).width(300);
                }
                else{
                    $("#divCampi"+i).height(350);
                    $("#divCampi"+i).width(250);
                    cont=0;
                }
            });
        }

    }
    function parseJwt(token) {
        let payload = token.split(".")[1];
        payload = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(payload));
    }
});

