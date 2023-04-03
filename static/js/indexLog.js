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
    //$("#prenota").show();
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
            caricaProfilo(JSON.parse(serverData));
            let Prenotazioni=sendRequestNoCallback("/api/Prenotazioni","GET",{});
            Prenotazioni.fail(function(jqXHR){
                error(jqXHR);
            });
            Prenotazioni.done(function(serverData){
                caricaPrenotazioni(JSON.parse(serverData),payload);
                
            });
            let visualCampi=sendRequestNoCallback("/api/visualCampi","GET",{});
            visualCampi.fail(function(jqXHR){
                error(jqXHR);
            });
            visualCampi.done(function(serverData){
                caricaCampi(JSON.parse(serverData),payload);
                
            })
        });

    }
    document.getElementById("tagLogin").addEventListener("click",function (){
        // Logout
        localStorage.setItem("token", "corrupted");
        localStorage.setItem("user",null);
        window.location.href = "index.html";
    });
    document.getElementById("btnAdmin").addEventListener("click",function (){
        let tokenPreso = localStorage.getItem("token");
        let payload = parseJwt(tokenPreso);
        if (payload.admin == true)
            window.location = "admin.html";
        else
            modal2();
    });

    function caricaProfilo(data){
        $("#userProfilo").html(data.User);
        $("#nomeProfilo").html(data.Nome);
        $("#cognomeProfilo").html(data.Cognome);
        $("#dataProfilo").html(data.DataNascita);
        $("#mailProfilo").html(data.Mail);
    }

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
        $("#modalBody").html("NON HAI ACCESSO A QUESTA AREA");
        $("#ModalErrore").on("hidden.bs.modal", function(){
        });
        $("#modalClose").on("click", function(){
            $("#ModalErrore").modal("hide");
        });
    }

    function modal3 (){
        $("#ModalErrore").modal("show");
        $("#exampleModalLabel").html("ATTENZIONE!!");
        $("#modalBody").html("QUESTO CAMPO È GIÀ OCCUPATO");
        $("#ModalErrore").on("hidden.bs.modal", function(){
        });
        $("#modalClose").on("click", function(){
            $("#ModalErrore").modal("hide");
        });
    }
    function caricaPrenotazioni(data,payload){
        console.log(data);
        for (let i=0;i<data.length;i++)
        {
            let divCard=$("<div class='col'>"+
              "<div class='our_solution_category'>"+
                "<div class='solution_cards_box'>"+
                  "<div class='solution_card'>"+
                    "<div class='hover_color_bubble'></div>"+
                    
                    "<div class='solu_title'>"+
                      "<h3>Prenotazione "+data[i]._id+"</h3>"+
                    "</div>"+
                    "<div class='solu_description'>"+
                      "<p id='idPren"+i+"'>"+
                      "</p>"+
                      "<p id='idPrenotante"+i+"'>"+
                      "</p>"+
                      "<p id='idCampo"+i+"'>"+
                      "</p>"+
                      "<p id='data"+i+"'>"+
                      "</p>"+
                      "<button type='button' class='read_more_btn'>Read More</button>"+
                    "</div>"+
                  "</div>"+
                  
                "</div>"+
                "<!--  -->"+
                
              "</div>"+
            "</div>"+
          "</div>");
          $("#divCard").append(divCard);
          $("#idPrenotante"+i).html("Nome: "+payload.nome);
          //$("#idCampo").html(data[0].idCampo);
          $("#data"+i).html("Data prenotazione: " + data[i].DataPrenotazione.split('T')[0].toString());
        }
        
  
    }
    function caricaCampi(serverData,payload)
    {
        console.log(serverData);
        
        for (let i=0;i<serverData.length;i++)
        {   
            let IdCampo=serverData[i]._id;
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
                "<center><button class='btn btn-collapse btnPrenota' type='button' id='btnPrenota"+i+"' data-toggle='collapse' data-target='#collapseExample"+i+"' aria-expanded='false' aria-controls='collapseExample"+i+"'> PRENOTA </button></center>"+
                "<div class='collapse' id='collapseExample"+i+"'>"+
                  "<div class='card card-body'>"+
                    "<form id='prenota' class='form' data-aos='fade-left'>"+
                    "<input class='input' id='txtNome"+i+"' placeholder='Nome' type='text' required=''>"+
                    "<input class='input' id='txtCognome"+i+"' placeholder='Cognome' type='text' required=''>"+ 
                    "<input class='input' id='txtMail"+i+"' placeholder='Email' type='email' required=''> "+
                    "<input class='input' id='txtData"+i+"' placeholder='' type='date' required=''>"+
                    "<input class='input' id='txtOra"+i+"'  placeholder='' type='time' required=''>"+
                    "<input class='input' id='txtFine"+i+"' placeholder='' type='time' required=''>"+
                    "<button class='btn btn-primary' id='btnInviaPren"+i+"'>Invia</button"+
                  "</form>"+
                  "</div>"+
               "</div>"+
              "</div>"+
            "</div>"+
          "</div>");
          $("#ContCampi").append(divCampi);
          $("#txtNome"+i).val(payload.nome);
          $("#txtCognome"+i).val(payload.cognome);
          $("#txtMail"+i).val(payload.mail);
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
            document.getElementById("btnInviaPren"+i).addEventListener("click",function (event){
                if($("#txtNome"+i).val()=="" || $("#txtCognome"+i).val()=="" || $("#txtMail"+i).val()=="" || $("#txtData"+i).val()=="" || $("#txtOra"+i).val()=="")
                document.getElementById("btnInviaPren"+i).removeEventListener("click",function(){});
                else
                {
                    event.preventDefault();
                    $('html,body').css('cursor','wait');
                    let prenot={};
                    let id = sendRequestNoCallback("/api/getIdPren","GET",{});
                    id.fail(function (jqXHR) {
                        error(jqXHR);
                        $('html,body').css('cursor','default');
                    });
                    id.done(function (serverData){
                        let pay = parseJwt(localStorage.getItem("token"));
                        serverData = JSON.parse(serverData);
                        let id = parseInt(serverData) +1;
                        console.log(pay);
                        prenot._id = parseInt(id);
                        prenot.idPrenotante = pay.id;
                        prenot.idCampo=IdCampo;
                        let string = new Date($("#txtData"+i).val().toString() + " " + $("#txtOra"+i).val().toString());
                        prenot.Giorno = $("#txtData"+i).val();
                        prenot.DataPrenotazione= string;
                        console.log(string);
                        string = new Date ($("#txtData"+i).val().toString() + " " + $("#txtFine"+i).val().toString())
                        prenot.DataFine = string;
                        console.log(string);
                        console.log(prenot);

                        let controlloInsert = sendRequestNoCallback("/api/ctrlPrenotazione","POST",prenot);
                        controlloInsert.fail(function (jqXHR) {
                            error(jqXHR);
                            $('html,body').css('cursor','default');
                            modal();
                        });
                        controlloInsert.done(function (serverData){
                            console.log(serverData);
                        });
                        /*
                        let insert = sendRequestNoCallback("/api/Prenota","POST",prenot);
                        insert.fail(function (jqXHR) {
                            error(jqXHR);
                            $('html,body').css('cursor','default');
                            modal();
                        });
                        insert.done(function (serverData){
                            window.location="loginOk.html";
                        });*/
            
                    });
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

