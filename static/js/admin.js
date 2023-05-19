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
    $("#inputCampo").hide();
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

        document.getElementById("check").checked = true;

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

    document.getElementById("btnNuovoCampo").addEventListener("click", function (){
        $("#inputCampo").show();
    })

    document.getElementById("btnInserisci").addEventListener("click", function (){
        let nuovoCampo = {};
        if(document.getElementById("prezzo").value == "" || document.getElementById("città").value == "" || document.getElementById("via").value == "")
        {
            modal2()
        }
        else
        {
            $('html,body').css('cursor','wait');

            let id = sendRequestNoCallback("/api/getIdCampo","GET",{});
            id.fail(function (jqXHR) {
                error(jqXHR);
                $('html,body').css('cursor','default');
            });
            id.done(function (serverData) {
                serverData = JSON.parse(serverData);
                let id = parseInt(serverData) + 1;
                nuovoCampo._id = parseInt(id);
                const btn = document.querySelector('#btn');
                const radioButtons = document.querySelectorAll('input[name="tipo"]');
                let selectedSize;
                for (const radioButton of radioButtons) {
                    if (radioButton.checked) {
                        selectedSize = radioButton.value;
                        break;
                    }
                }
                nuovoCampo.Tipologia = selectedSize.toString();
                nuovoCampo.PrezzoOrario = document.getElementById("prezzo").value.toString();
                nuovoCampo.Citta = document.getElementById("città").value.toString();
                nuovoCampo.Posizione = document.getElementById("via").value.toString();
                console.log(nuovoCampo);

                let insert = sendRequestNoCallback("/api/nuovoCampo","POST",nuovoCampo);
                insert.fail(function (jqXHR) {
                    error(jqXHR);
                    $('html,body').css('cursor','default');
                });
                insert.done(function (serverData){
                    $('html,body').css('cursor','default');
                    window.location.reload()
                });

            });
        }

    })


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
    function modal2 (){
        $("#ModalErrore").modal("show");
        $("#exampleModalLabel").html("ATTENZIONE!!");
        $("#modalBody").html("NON HAI INSERITO TUTTI I DATI");
        $("#ModalErrore").on("hidden.bs.modal", function(){
            $("#ModalErrore").modal("hide");
        });
        $("#modalClose").on("click", function(){
            $("#ModalErrore").modal("hide");
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
            $("#txtCittà"+i).val(serverData[i].Citta);
            $("#txtPosizione"+i).val(serverData[i].Posizione);
            $("#idTipologia"+i).html("Tipologia: "+serverData[i].Tipologia);
            $("#idPrezzo"+i).html("Prezzo ad ora: "+serverData[i].PrezzoOrario+" €");
            $("#idCittà"+i).html("Città: "+serverData[i].Citta);
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
                        mod.Citta=$("#txtCittà"+i).val();
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

