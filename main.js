

$(document).ready(function(){
    //Cerco i risultati della ricerca alla pressione del bottone cerca
    $("#search-header button").click(function() {
        //Registro l'input dal campo search alla pressione del pulsante cerca
        var search_value = $("#search-header input").val();

        //Svuoto il campo di ricerca
        $("#search-header input").val("");
        console.log(search_value);

        find_movies(search_value);
        find_series(search_value);
    });

    //Cerco i risultati della ricerca alla pressione del tasto invio
    $("#search-header input").keyup(function() {
        if (event.which == 13) {
            //Registro l'input dal campo search alla pressione del pulsante cerca
            var search_value = $("#search-header input").val();

            //Svuoto il campo di ricerca
            $("#search-header input").val("");
            console.log(search_value);

            find_movies(search_value);
            find_series(search_value);
        };

    });
});


//FUNZIONI
//Funzione per ricerca film
function find_movies(search) {
    //Procedo con la chiamata ajax con la ricerca dell'utente
    $.ajax({
        url : "https://api.themoviedb.org/3/search/movie",
        method : "GET",
        data : {
            api_key : "fc16baf9f9f37096b14c800ebf114a8a",
            language : "it",
            page : 1,
            query : search
            },
        success: function(data) {
                //Svuoto l'html nel campo dei risultati
                $("main .movies").text("");
                //Inserisco nel campo dei risultati una stringa con il numero dei risultati
                $("main .movies").append("<p>FILM - Il numero dei risultati per '" + search + "' è: " + data.results.length);

                //Utilizzo la risposta dell'ajax per stampare in serie titolo,  titolo originale, lingua, voto
                for (var i = 0; i < data.results.length; i++) {
                    //Creo un oggetto con i valori che mi interessano
                    var html_element = {
                        title : data.results[i].title,
                        poster : data.results[i].poster_path,
                        original_title : data.results[i].original_title,
                        language : getFlags(data.results[i].original_language),
                        rating : star_rating(data.results[i].vote_average)
                    };

                    //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                    var template_html = $("#movie-result-template").html();

                    var template_function = Handlebars.compile(template_html);

                    var html_finale = template_function(html_element);
                    $("main .movies").append(html_finale);
                    console.log(html_element);
                }
            },
        error : function() {
            alert("Il cinema è chiuso");
            }
    })
}

//Funzione per ricerca serie tv
function find_series(search) {


    //Procedo con la chiamata ajax con la ricerca dell'utente
    $.ajax({
        url : "https://api.themoviedb.org/3/search/tv",
        method : "GET",
        data : {
            api_key : "fc16baf9f9f37096b14c800ebf114a8a",
            language : "it",
            page : 1,
            query : search
            },
        success: function(data) {
                //Svuoto l'html nel campo dei risultati
                $("main .series").text("");
                //Inserisco nel campo dei risultati una stringa con il numero dei risultati
                $("main .series").append("<p>SERIE TV - Il numero dei risultati per '" + search + "' è: " + data.results.length);

                //Utilizzo la risposta dell'ajax per stampare in serie titolo,  titolo originale, lingua, voto
                for (var i = 0; i < data.results.length; i++) {
                    //Creo un oggetto con i valori che mi interessano
                    var html_element = {
                        title : data.results[i].name,
                        poster : data.results[i].poster_path,
                        original_title : data.results[i].original_name,
                        language : getFlags(data.results[i].original_language),
                        rating : star_rating(data.results[i].vote_average)
                    };

                    //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                    var template_html = $("#movie-result-template").html();

                    var template_function = Handlebars.compile(template_html);

                    var html_finale = template_function(html_element);
                    $("main .series").append(html_finale);
                    console.log(html_element);
                }
            },
        error : function() {
            alert("Il cinema è chiuso");
            }
    })
}

//Funzione per trasformare il voto in decimi in stelline da 1 a 5
function star_rating(rating) {
    //Trasformo il voto in decimi in un valore da 1 a 5, arrotondando per eccesso
    var rate5 = Math.ceil(rating / 2);
    //Creo una variabile con le stelline e la riempio a seconda del risultato
    var ratingHTML = "";
    for (i = 0; i < rate5; i++) {
        ratingHTML += '<i class="fas fa-star"></i>';
    };
    for (i = 0; i < (5 - rate5); i++) {
        ratingHTML += '<i class="far fa-star"></i>';
    };
    console.log(ratingHTML);
    return ratingHTML;
}

function getFlags(nation) {
    if (nation == "en") {
        return "img/en.png";
    } else if (nation == "it") {
        return "img/ita.png";
    } else if (nation == "de") {
        return "img/ger.png";
    } else if (nation == "es") {
        return "img/esp.png";
    } else if (nation == "fr") {
        return "img/fr.png";
    } else if (nation == "ja") {
        return "img/jap.png";
    } else if (nation == "pt") {
        return "img/pt.png";
    }else {
        return "img/un.png";
    }
}
