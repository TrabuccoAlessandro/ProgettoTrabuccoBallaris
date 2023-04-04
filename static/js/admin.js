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
        let currentTipologia;
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
                    "<option id='Terra"+i+"' class='input' value='Terra'>Terra</option>"+
                    "<option id='Sintetico"+i+"' class='input' value='Sintetico'>Sintetico</option>"+
                    "<option id='Palestra"+i+"' class='input' value='Palestra'>Palestra</option>"+
                    "</select>"+
                    "<input class='input' id='txtPrezzo"+i+"' placeholder='"+serverData[i].PrezzoOrario+"' value='15' type='text' disabled>"+ 
                    "<input class='input' id='txtCittà"+i+"' type='text' required=''> "+
                    "<input class='input' id='txtPosizione"+i+"' type='text' required=''>"+
                    "<button class='btn btn-primary' id='btnModifica"+i+"'>Modifica</button"+
                    "</form>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>");
            $("#ContCampi").append(divCampi);
            currentTipologia=document.getElementById(serverData[i].Tipologia+""+i)
            currentTipologia.selected=true;
            $("#txtCittà"+i).val(serverData[i].Città);
            $("#txtPosizione"+i).val(serverData[i].Posizione);
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
                document.getElementById("btnModifica"+i).addEventListener("click",function(event){
                    if($("#selectTipo"+i).val()=="" || $("#txtPrezzo"+i).val()=="" || $("#txtCittà"+i).val()=="" || $("#txtPosizione"+i).val()=="" || $("#selectQualita"+i).val()=="")
                    document.getElementById("btnModifica"+i).removeEventListener("click",function(){});
                    else
                    {
                        event.preventDefault();
                        $('html,body').css('cursor','wait');
                        let mod={};
                        mod._id=serverData[i]._id;
                        mod.Tipologia=$("#selectTipo"+i).val();
                        mod.PrezzoOrario=$("#txtPrezzo"+i).val();
                        mod.Città=$("#txtCittà"+i).val();
                        mod.Posizione=$("#txtPosizione"+i).val();
                        mod.Qualità=$("#selectQualita"+i).val();
                        let modifica=sendRequestNoCallback("/api/campiUpdate","POST",mod);
                        modifica.fail(function (jqXHR) {
                            error(jqXHR);
                            $('html,body').css('cursor','default');
                            modal();
                        });
                        modifica.done(function(serverData){
                            window.location="admin.html";
                        })
                    }
                })
            });
        }

    }
    function parseJwt(token) {
        let payload = token.split(".")[1];
        payload = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(payload));
    }
});

