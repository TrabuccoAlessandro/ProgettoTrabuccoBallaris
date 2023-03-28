"use strict"
$(()=>{

    if(localStorage.getItem("token") !="corrupted")
    {
        let tokenPreso = localStorage.getItem("token");
        let payload = parseJwt(tokenPreso);
        let controlloSessione = sendRequestNoCallback("/api/ctrlSession","GET",{});
        controlloSessione.fail(function (jqXHR){
            error(jqXHR);
            localStorage.setItem("token", "corrupted");
            localStorage.setItem("user",null);
            $("#ModalErrore").modal("show");
            $("#exampleModalLabel").html("ATTENZIONE!!");
            $("#modalBody").html("TOKEN SCADUTO O CORROTTO!!");
            $("#ModalErrore").on("hidden.bs.modal", function(){
                window.location.href = "index.html";
            });
            $("#modalClose").on("click", function(){
                window.location.href = "index.html";
            });
        });
        controlloSessione.done(function (serverData){
            caricaProfilo(JSON.parse(serverData));
            let Prenotazioni=sendRequestNoCallback("/api/Prenotazioni","GET",{});
            Prenotazioni.fail(function(jqXHR){
                error(jqXHR);
            });
            Prenotazioni.done(function(serverData){
                caricaPrenotazioni(JSON.parse(serverData),payload);
            })
            
        });
    }
    document.getElementById("tagLogin").addEventListener("click",function (){
        // Logout
        localStorage.setItem("token", "corrupted");
        localStorage.setItem("user",null);
        window.location.href = "index.html";
    });

    function caricaProfilo(data){
        $("#userProfilo").html(data.User);
        $("#nomeProfilo").html(data.Nome);
        $("#cognomeProfilo").html(data.Cognome);
        $("#dataProfilo").html(data.DataNascita);
        $("#mailProfilo").html(data.Mail);
    }
    function caricaPrenotazioni(data,payload){
        console.log(data);
        for (let i=0;i<data.length;i++)
        {
        
            let divCard=$("<div class='col-lg-12 col-md-12 col-sm-12'>"+
              "<div class='our_solution_category'>"+
                "<div class='solution_cards_box'>"+
                  "<div class='solution_card'>"+
                    "<div class='hover_color_bubble'></div>"+
                    
                    "<div class='solu_title'>"+
                      "<h3>Prenotazione "+data[i]._id+"</h3>"+
                    "</div>"+
                    "<div class='solu_description'>"+
                      "<p id='idPren'>"+
                      "</p>"+
                      "<p id='idPrenotante'>"+
                      "</p>"+
                      "<p id='idCampo'>"+
                      "</p>"+
                      "<p id='data'>"+
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
          $("#idPren").html("ID prenotazione: "+data[i]._id);
          $("#idPrenotante").html("Nome: "+payload[i].nome);
          //$("#idCampo").html(data[0].idCampo);
          $("#data").html("Data prenotazione: "+data[i].DataPrenotazione);
        }
        
    }
    function parseJwt(token) {
        let payload = token.split(".")[1];
        payload = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(payload));
    }
});
