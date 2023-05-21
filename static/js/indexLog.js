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
    function modal4 (){
        $("#ModalErrore").modal("show");
        $("#exampleModalLabel").html("ATTENZIONE!!");
        $("#modalBody").html("ERRORE NELL'INSERIMENTO DELL'ORA");
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
            let id;
            let divCard;
            if(data[i].Pagato == false)
            {
                id = data[i]._id;
                divCard=$("<div class='col'>" +
                    "<div class='our_solution_category'>"+
                    "<div class='solution_cards_box'>"+
                    "<div class='solution_card'>"+
                    "<div class='hover_color_bubble'></div>"+

                    "<div class='solu_title'>"+
                    "<h3>Prenotazione</h3>"+
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
                    "<button type='button' id='btnPren "+id+"' class='read_more_btn'>Read More</button> <p></p>"+
                    "<button style='background-color: red;  color: red' id='btnElPren "+id+"' class='danger-color'>DEL</button> <span></span>"+
                    "<button style=' margin-top: -3px; background-color: red;  color: blue' id='btnPaga "+id+"' class='btn btn-danger'>PAY</button>"+
                    "</div>"+
                    "</div>"+

                    "</div>"+
                    "<!--  -->"+

                    "</div>"+
                    "</div>"+
                    "</div>");
                $("#divCard").append(divCard);
                document.getElementById("btnPaga "+id ).addEventListener("click",function (){
                    $("#transazione").text("TRANSAZIONE: "+this.id.split(' ')[1]);
                    $("#cvv").val("");
                    $("#numCarta").val("");
                    $("#scadCarta").val("");
                    $("#propCarta").val("");
                    $("#modalPaga").modal("show");
                    $("#modalPaga").on("hidden.bs.modal", function(){
                    });
                    $("#modalClose").on("click", function(){
                        $("#modalPaga").modal("hide");
                    });
                    $('html,body').css('cursor','default');
                })
            }
            else
            {
                id = data[i]._id;
                divCard=$("<div class='col'>"+
                    "<div class='our_solution_category'>"+
                    "<div class='solution_cards_box'>"+
                    "<div class='solution_card'>"+
                    "<div class='hover_color_bubble'></div>"+

                    "<div class='solu_title'>"+
                    "<h3>Prenotazione</h3>"+
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
                    "<button type='button' id='btnPren "+id+"' class='read_more_btn'>Read More</button> <p></p><span></span>"+
                    "<button style='background-color: red; margin-top: 5px; color: red' id='btnElPren "+id+"' class='btn btn-danger'>ELIMINA</button>"+
                    "</div>"+
                    "</div>"+

                    "</div>"+
                    "<!--  -->"+

                    "</div>"+
                    "</div>"+
                    "</div>");
                $("#divCard").append(divCard);
            }
          $("#idPrenotante"+i).html("Nome: "+payload.nome);
          $("#idCampo").html(data[0].idCampo);
          $("#data"+i).html("Data prenotazione: " + data[i].DataPrenotazione.split('T')[0].toString());
            document.getElementById("btnElPren "+id).addEventListener("click",function (){
                $('html,body').css('cursor','wait');
                let idElim = parseInt(this.id.split(' ')[1]);
                let eliminaPren = sendRequestNoCallback("/api/eliminaPren","POST",{_id:idElim})
                eliminaPren.fail(function (jqXHR) {
                    error(jqXHR);
                    $('html,body').css('cursor','default');
                });
                eliminaPren.done(function (serverdata) {
                    window.location.reload();
                });

            })
            document.getElementById("btnPren "+id).addEventListener("click", function (){
                $('html,body').css('cursor','wait');
                //CARICA INFO PRENOTAZIONE
                let idPren = parseInt(this.id.split(' ')[1].toString());
                $("#lblId").text(idPren);
                $("#lblId").hide();
                let infoPren = sendRequestNoCallback("/api/infoPren", "POST",{_id:idPren})
                infoPren.fail(function (jqXHR) {
                    error(jqXHR);
                    $('html,body').css('cursor','default');
                });
                infoPren.done(function (serverData){
                    serverData = JSON.parse(serverData)
                    console.log(serverData);
                    let infoCamp = sendRequestNoCallback("/api/infoCamp","POST",{_id:serverData.idCampo})
                    infoCamp.fail(function (jqXHR) {
                        error(jqXHR);
                        $('html,body').css('cursor','default');
                    });
                    infoCamp.done(function (dataServer){
                        console.log(JSON.parse(dataServer));
                        dataServer = JSON.parse(dataServer);
                        $("#lblPrezzo").text(serverData.Prezzo);
                        $("#lblData").text(serverData.DataPrenotazione.split('T')[0]);
                        let oraStart = serverData.DataPrenotazione.split('T')[1];
                        $("#lblOraInzio").text(oraStart.split(':')[0].toString() +":00");
                        let oraArriv = serverData.DataFine.split('T')[1];
                        $("#lblOraFine").text(oraArriv.split(':')[0].toString() +":00");
                        $("#lblPosizione").text(dataServer.Citta.toString() + "--" + dataServer.Posizione);
                        $("#modalInfo").modal("show");
                        $("#modalInfo").on("hidden.bs.modal", function(){
                        });
                        $("#modalClose").on("click", function(){
                            $("#modalInfo").modal("hide");
                        });
                        $('html,body').css('cursor','default');

                    })
                })

            })
        }
        
  
    }
    function caricaCampi(serverData,payload)
    {
        console.log(serverData);
        let currentOption;
        let currentOption1;
        let oggi = new Date();
        let settimanaSuccessiva = new Date();
        settimanaSuccessiva.setDate(oggi.getDate() + 7);
        var minDate = formatDate(oggi);
        var maxDate = formatDate(settimanaSuccessiva);
        var now = new Date();
        var currentHour = now.getHours();
        let currentHour1 = currentHour+1;
        console.log(currentHour1);
        for (let i=0;i<serverData.length;i++)
        {
            let IdCampo;
            let divCampi;
            if(serverData[i].Tipologia == "Terra")
            {
                IdCampo=serverData[i]._id;
                console.log(serverData[i])
                divCampi=$("<div class='flip-card' id='divCampi"+i+"' data-aos='fade-left'>"+
                    "<div class='flip-card-inner'>"+
                    "<div class='flip-card-front terra'>"+
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
                    "<input class='input' id='txtData"+i+"' placeholder='' type='date' min='"+minDate+"' max='"+maxDate+"' required=''>"+
                    "<select id='selectQualita"+i+"' class='form-select input' aria-label='Select'>"+
                    "<option class='input' selected value='Bronze'>Bronze</option>"+
                    "<option class='input' value='Silver'>Silver</option>"+
                    "<option class='input' value='Gold'>Gold</option>"+
                    "</select>"+

                    //"<input class='input' id='txtOra"+i+"'  placeholder='' type='time' required=''>"+
                    "<select class='input form-select' id='txtOra"+i+"'><option value='08:00' id='"+i+"ora08'>08:00<option value='09:00' id='"+i+"ora09'>09:00<option value='10:00' id='"+i+"ora10'>10:00<option value='11:00' id='"+i+"ora11'>11:00<option value='12:00' id='"+i+"ora12'>12:00<option value='13:00' id='"+i+"ora13'>13:00<option value='14:00' id='"+i+"ora14'>14:00<option value='15:00' id='"+i+"ora15'>15:00<option value='16:00' id='"+i+"ora16'>16:00<option value='17:00' id='"+i+"ora17'>17:00<option value='18:00' id='"+i+"ora18'>18:00<option value='19:00' id='"+i+"ora19'>19:00<option value='20:00' id='"+i+"ora20'>20:00<option value='21:00' id='"+i+"ora21'>21:00<option value='22:00' id='"+i+"ora22'>22:00<option value='23:00' id='"+i+"ora23'>23:00</select>"+
                    "<select class='input form-select' id='txtFine"+i+"'><option value='08:00' id='"+i+"fine08'>08:00<option value='09:00' id='"+i+"fine09'>09:00<option value='10:00' id='"+i+"fine10'>10:00<option value='11:00' id='"+i+"fine11'>11:00<option value='12:00' id='"+i+"fine12'>12:00<option value='13:00' id='"+i+"fine13'>13:00<option value='14:00' id='"+i+"fine14'>14:00<option value='15:00' id='"+i+"fine15'>15:00<option value='16:00' id='"+i+"fine16'>16:00<option value='17:00' id='"+i+"fine17'>17:00<option value='18:00' id='"+i+"fine18'>18:00<option value='19:00' id='"+i+"fine19'>19:00<option value='20:00' id='"+i+"fine20'>20:00<option value='21:00' id='"+i+"fine21'>21:00<option value='22:00' id='"+i+"fine22'>22:00<option value='23:00' id='"+i+"fine23'>23:00</select>"+
                    //"<input class='input' id='txtFine"+i+"' placeholder='' type='time' steo=3600 required=''>"+
                    "<button class='btn btn-primary' id='btnInviaPren"+i+"'>Invia</button"+
                    "</form>"+
                    "</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>");
                $("#ContCampi").append(divCampi);
            }
            else if (serverData[i].Tipologia == "Sintetico")
            {
                IdCampo=serverData[i]._id;
                console.log(serverData[i])
                divCampi=$("<div class='flip-card' id='divCampi"+i+"' data-aos='fade-left'>"+
                    "<div class='flip-card-inner'>"+
                    "<div class='flip-card-front sintetico'>"+
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
                    "<input class='input' id='txtData"+i+"' placeholder='' type='date' min='"+minDate+"' max='"+maxDate+"' required=''>"+
                    "<select id='selectQualita"+i+"' class='form-select input' aria-label='Select'>"+
                    "<option class='input' selected value='Bronze'>Bronze</option>"+
                    "<option class='input' value='Silver'>Silver</option>"+
                    "<option class='input' value='Gold'>Gold</option>"+
                    "</select>"+

                    //"<input class='input' id='txtOra"+i+"'  placeholder='' type='time' required=''>"+
                    "<select class='input form-select' id='txtOra"+i+"'><option value='08:00' id='"+i+"ora08'>08:00<option value='09:00' id='"+i+"ora09'>09:00<option value='10:00' id='"+i+"ora10'>10:00<option value='11:00' id='"+i+"ora11'>11:00<option value='12:00' id='"+i+"ora12'>12:00<option value='13:00' id='"+i+"ora13'>13:00<option value='14:00' id='"+i+"ora14'>14:00<option value='15:00' id='"+i+"ora15'>15:00<option value='16:00' id='"+i+"ora16'>16:00<option value='17:00' id='"+i+"ora17'>17:00<option value='18:00' id='"+i+"ora18'>18:00<option value='19:00' id='"+i+"ora19'>19:00<option value='20:00' id='"+i+"ora20'>20:00<option value='21:00' id='"+i+"ora21'>21:00<option value='22:00' id='"+i+"ora22'>22:00<option value='23:00' id='"+i+"ora23'>23:00</select>"+
                    "<select class='input form-select' id='txtFine"+i+"'><option value='08:00' id='"+i+"fine08'>08:00<option value='09:00' id='"+i+"fine09'>09:00<option value='10:00' id='"+i+"fine10'>10:00<option value='11:00' id='"+i+"fine11'>11:00<option value='12:00' id='"+i+"fine12'>12:00<option value='13:00' id='"+i+"fine13'>13:00<option value='14:00' id='"+i+"fine14'>14:00<option value='15:00' id='"+i+"fine15'>15:00<option value='16:00' id='"+i+"fine16'>16:00<option value='17:00' id='"+i+"fine17'>17:00<option value='18:00' id='"+i+"fine18'>18:00<option value='19:00' id='"+i+"fine19'>19:00<option value='20:00' id='"+i+"fine20'>20:00<option value='21:00' id='"+i+"fine21'>21:00<option value='22:00' id='"+i+"fine22'>22:00<option value='23:00' id='"+i+"fine23'>23:00</select>"+
                    //"<input class='input' id='txtFine"+i+"' placeholder='' type='time' steo=3600 required=''>"+
                    "<button class='btn btn-primary' id='btnInviaPren"+i+"'>Invia</button"+
                    "</form>"+
                    "</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>");
                $("#ContCampi").append(divCampi);
            }
            else if (serverData[i].Tipologia == "Erba")
            {
                IdCampo=serverData[i]._id;
                console.log(serverData[i])
                divCampi=$("<div class='flip-card' id='divCampi"+i+"' data-aos='fade-left'>"+
                    "<div class='flip-card-inner'>"+
                    "<div class='flip-card-front erba'>"+
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
                    "<input class='input' id='txtData"+i+"' placeholder='' type='date' min='"+minDate+"' max='"+maxDate+"' required=''>"+
                    "<select id='selectQualita"+i+"' class='form-select input' aria-label='Select'>"+
                    "<option class='input' selected value='Bronze'>Bronze</option>"+
                    "<option class='input' value='Silver'>Silver</option>"+
                    "<option class='input' value='Gold'>Gold</option>"+
                    "</select>"+

                    //"<input class='input' id='txtOra"+i+"'  placeholder='' type='time' required=''>"+
                    "<select class='input form-select' id='txtOra"+i+"'><option value='08:00' id='"+i+"ora08'>08:00<option value='09:00' id='"+i+"ora09'>09:00<option value='10:00' id='"+i+"ora10'>10:00<option value='11:00' id='"+i+"ora11'>11:00<option value='12:00' id='"+i+"ora12'>12:00<option value='13:00' id='"+i+"ora13'>13:00<option value='14:00' id='"+i+"ora14'>14:00<option value='15:00' id='"+i+"ora15'>15:00<option value='16:00' id='"+i+"ora16'>16:00<option value='17:00' id='"+i+"ora17'>17:00<option value='18:00' id='"+i+"ora18'>18:00<option value='19:00' id='"+i+"ora19'>19:00<option value='20:00' id='"+i+"ora20'>20:00<option value='21:00' id='"+i+"ora21'>21:00<option value='22:00' id='"+i+"ora22'>22:00<option value='23:00' id='"+i+"ora23'>23:00</select>"+
                    "<select class='input form-select' id='txtFine"+i+"'><option value='08:00' id='"+i+"fine08'>08:00<option value='09:00' id='"+i+"fine09'>09:00<option value='10:00' id='"+i+"fine10'>10:00<option value='11:00' id='"+i+"fine11'>11:00<option value='12:00' id='"+i+"fine12'>12:00<option value='13:00' id='"+i+"fine13'>13:00<option value='14:00' id='"+i+"fine14'>14:00<option value='15:00' id='"+i+"fine15'>15:00<option value='16:00' id='"+i+"fine16'>16:00<option value='17:00' id='"+i+"fine17'>17:00<option value='18:00' id='"+i+"fine18'>18:00<option value='19:00' id='"+i+"fine19'>19:00<option value='20:00' id='"+i+"fine20'>20:00<option value='21:00' id='"+i+"fine21'>21:00<option value='22:00' id='"+i+"fine22'>22:00<option value='23:00' id='"+i+"fine23'>23:00</select>"+
                    //"<input class='input' id='txtFine"+i+"' placeholder='' type='time' steo=3600 required=''>"+
                    "<button class='btn btn-primary' id='btnInviaPren"+i+"'>Invia</button"+
                    "</form>"+
                    "</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>");
                $("#ContCampi").append(divCampi);
            }
          if(currentHour>8 && currentHour <23)
          {
            currentOption = document.getElementById(i+'ora' + currentHour);
            currentOption.selected = true;
            currentOption1 = document.getElementById(i+'fine' + currentHour1);
            currentOption1.selected = true;
          }
          else
          {
            currentOption = document.getElementById(i+'ora08');
            currentOption.selected = true;
            currentOption1 = document.getElementById(i+'fine09');
            currentOption1.selected = true;
          }
          $("#txtNome"+i).val(payload.nome);
          $("#txtCognome"+i).val(payload.cognome);
          $("#txtMail"+i).val(payload.mail);
          $("#idTipologia"+i).html("Tipologia: "+serverData[i].Tipologia);
          $("#idPrezzo"+i).html("Prezzo ad ora: "+serverData[i].PrezzoOrario+" €");
          $("#idCittà"+i).html("Città: "+serverData[i].Citta);
          let cont=0;
          document.getElementById("btnPrenota"+i).addEventListener("click",function (){
            cont++;
            if(cont==1){
                $("#divCampi"+i).height(810);
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
                        let string =$("#txtData"+i).val().toString() + " " + $("#txtOra"+i).val().toString();
                        prenot.Giorno = $("#txtData"+i).val();
                        prenot.DataPrenotazione= string;
                        console.log(string);
                        string = $("#txtData"+i).val().toString() + " " + $("#txtFine"+i).val().toString();
                        prenot.DataFine = string;
                        prenot.Tipo = $("#selectQualita"+i).val();
                        prenot.Pagato = false;
                        console.log(string);
                        console.log(prenot);

                        let mail = {};

                        mail.mail = $("#txtMail"+i).val();
                        mail.nome = $("#txtNome"+i).val();
                        mail.cognome = $("#txtCognome"+i).val();
                        mail.prenotazione = prenot;


                        let controlloInsert = sendRequestNoCallback("/api/ctrlPrenotazione","POST",prenot);
                        controlloInsert.fail(function (jqXHR) {
                            error(jqXHR);
                            $('html,body').css('cursor','default');
                            modal();
                        });
                        controlloInsert.done(function (serverData){
                            console.log(serverData);
                            if(serverData == "vuoto")
                            {
                                let prezzoCampo = sendRequestNoCallback("/api/prezzoCampo", "POST", {_id:mail.prenotazione.idCampo});
                                console.log(mail);
                                prezzoCampo.fail(function (jqXHR){
                                    error(jqXHR);
                                });
                                prezzoCampo.done(function (serverData){
                                    serverData = JSON.parse(serverData);
                                    mail.prezzo = serverData.PrezzoOrario;
                                    let oraInizio = mail.prenotazione.DataPrenotazione.toString();
                                    oraInizio = oraInizio.split(' ')[1];
                                    let oraFine = mail.prenotazione.DataFine.toString();
                                    oraFine = oraFine.split(' ')[1];

                                    let ore = new Date(mail.prenotazione.DataFine.toString()).getHours() - new Date(mail.prenotazione.DataPrenotazione.toString()).getHours();
                                    let prezzo;
                                    switch (mail.prenotazione.Tipo){
                                        case "Bronze":
                                            prezzo = parseInt(mail.prezzo) * parseInt(ore);
                                            break;
                                        case "Silver":
                                            prezzo = (parseInt(mail.prezzo) + 5) * parseInt(ore);
                                            break;
                                        case "Gold":
                                            prezzo = (parseInt(mail.prezzo) +20) * parseInt(ore);
                                            break;

                                    }
                                    console.log(prezzo);
                                    mail.prezzo = prezzo;
                                    prenot.Prezzo = prezzo;
                                    mail.prenotazione = prenot;
                                    console.log(prenot);

                                    let insert = sendRequestNoCallback("/api/Prenota","POST",prenot);
                                    insert.fail(function (jqXHR) {
                                        console.log(jqXHR.message);
                                        if(jqXHR.message=="Server Error: 403 - Inserimento orario errato")
                                        {
                                            error(jqXHR);
                                            $('html,body').css('cursor','default');
                                            modal4();
                                        }
                                        else{
                                            error(jqXHR);
                                            $('html,body').css('cursor','default');
                                            modal();
                                        }

                                    });
                                    insert.done(function (serverData){

                                        let mailPrenot = sendRequestNoCallback("/api/mailPrenot","POST",mail);
                                        mailPrenot.fail(function (jqXHR) {
                                            error(jqXHR);
                                            $('html,body').css('cursor','default');
                                        });
                                        mailPrenot.done(function (serverdata){
                                            window.location.reload()
                                        })
                                    });
                                })
                            }
                            else
                            {
                                $('html,body').css('cursor','default');
                                modal3();
                            }
                        });


                    });
                }
            })
        });
        
        }
    }
    document.getElementById("btnEseguiPay").addEventListener("click",function (){
        $('html,body').css('cursor','wait');
        $("#errPaga").text("");
        if((visa($("#numCarta").val().toString()) || masterCard($("#numCarta").val().toString())) && scadenza($("#scadCarta").val().toString()) && $("#propCarta").val().toString() != "" && cvv($("#cvv").val().toString())){
            let idPreno = parseInt($("#transazione").text().split(' ')[1]);
            let infoPreno = sendRequestNoCallback("/api/infoPren", "POST",{_id:idPreno})
            infoPreno.fail(function (jqXHR) {
                error(jqXHR);
                $('html,body').css('cursor','default');
            });
            infoPreno.done(function (serverData){
                serverData = JSON.parse(serverData)
                serverData.Pagato = true;
                let update = sendRequestNoCallback("/api/PrenUpdate","POST",serverData);
                update.fail(function (jqXHR){
                    console.error(jqXHR)
                    $('html,body').css('cursor','default');
                })
                update.done(function (serverData){
                    $('html,body').css('cursor','default');
                    window.location.reload();
                })
            });
        }
        else
        {
            $("#errPaga").text("ERRORE NEL PAGAMENTO");
            $('html,body').css('cursor','default');
        }
    })
    function formatDate(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
      }
    function parseJwt(token) {
        let payload = token.split(".")[1];
        payload = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(payload));
    }

    function masterCard(userInput) {
        return /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/ .test(userInput);
    }
    function visa(userInput){
            return /^4[0-9]{12}(?:[0-9]{3})?$/ .test(userInput);
    }
    function scadenza(userInput){
        return /^(0[1-9]|1[0-2])\/?([0-9]{2})$/ .test(userInput);
    }
    function cvv(userInput){
        return /^[0-9]{3,4}$/ .test(userInput);
    }
});
