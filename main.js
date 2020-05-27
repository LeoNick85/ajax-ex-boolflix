

$(document).ready(function(){
    //Faccio una chiamata ajax per avere la lista dei generi e li aggiungo uno per uno come filtri alla ricerca nella aside
    $.ajax({
        url : "https://api.themoviedb.org/3/genre/movie/list",
        method : "GET",
        data : {
            api_key : "fc16baf9f9f37096b14c800ebf114a8a",
            language : "it"
            },
        success: function(data) {
                //Utilizzo la risposta dell'ajax per stampare in serie i generi come checkbox
                for (var i = 0; i < data.genres.length; i++) {
                    addGenreFilter(data.genres[i].name);
                }
            },
        error : function() {
            alert("Error: Genres");
            }
    })

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
//Funzione per aggiungere un genere ai filtri, tramite template Handlebars
function addGenreFilter(genere) {
    var template_html = $("#genre-filter-template").html();
    var html_element = {
        genere : genere
    };
    var template_function = Handlebars.compile(template_html);
    var html_finale = template_function(html_element);
    $("aside div.search-filter").append(html_finale);
}


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
                //Inserisco nel campo relativo della tab il numero dei risultati
                $("#movies-tab .tot-result").text(data.total_results);
                //Conto il numero delle pagine e genero altrettanti bottoni in basso ai risultati. Per ogni pagina genero una scheda (nascosta) e la riempio con i relativi elementi
                var total_pages = data.total_pages;
                for (var i = 1; i <= total_pages; i++) {
                    //Inserisco i bottoni delle pagine con handlebars
                    var current_page = i;
                    var html_element = {
                        numero : current_page
                    };
                    var template_html = $("#page-button-template").html();
                    var template_function = Handlebars.compile(template_html);
                    var html_finale = template_function(html_element);
                    $("#movie-page").append(html_finale);

                    //Genero la scheda risultati relativa alla pagina
                    var html_element_page = {
                        tipo : "movies",
                        pagina : current_page
                    };
                    console.log("html page" + current_page);
                    var template_html = $("#page-template").html();
                    var template_function = Handlebars.compile(template_html);
                    var html_finale = template_function(html_element_page);
                    $("#movie-wrapper").append(html_finale);

                    // Faccio una chiamata ajax relativa alla pagina e genero le schede dei film per riempire la relativa pagina
                    $.ajax({
                        url : "https://api.themoviedb.org/3/search/movie",
                        method : "GET",
                        data : {
                            api_key : "fc16baf9f9f37096b14c800ebf114a8a",
                            language : "it",
                            page : current_page,
                            query : search
                            },
                        success: function(page_data) {
                                //Utilizzo la risposta dell'ajax per stampare in serie titolo,  titolo originale, lingua, voto
                                for (var j = 0; j < page_data.results.length; j++) {
                                    console.log("Numero pagina" + page_data.page);
                                    //Creo un oggetto con i valori che mi interessano
                                    var html_element_card = {
                                        title : page_data.results[j].title,
                                        poster : page_data.results[j].poster_path,
                                        original_title : data.results[j].original_title,
                                        language : getFlags(page_data.results[j].original_language),
                                        rating : star_rating(page_data.results[j].vote_average)
                                    };
                                    console.log(html_element_card);
                                    //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                                    var template_html_card = $("#movie-result-template").html();

                                    var template_function = Handlebars.compile(template_html_card);

                                    var html_finale_card = template_function(html_element_card);
                                    $("main .movies[data-movie-page=" + page_data.page + "]").append(html_finale_card);
                                }
                            },
                        error : function() {
                            alert("Il cinema è chiuso");
                            }
                    })
                }

                //
                //
                //
                //
                //
                //
                // //Utilizzo la risposta dell'ajax per stampare in serie titolo,  titolo originale, lingua, voto
                // for (var i = 0; i < data.results.length; i++) {
                //     //Creo un oggetto con i valori che mi interessano
                //     var html_element = {
                //         title : data.results[i].title,
                //         poster : data.results[i].poster_path,
                //         original_title : data.results[i].original_title,
                //         language : getFlags(data.results[i].original_language),
                //         rating : star_rating(data.results[i].vote_average)
                //     };
                //
                //     //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                //     var template_html = $("#movie-result-template").html();
                //
                //     var template_function = Handlebars.compile(template_html);
                //
                //     var html_finale = template_function(html_element);
                //     $("main .movies").append(html_finale);
                //     console.log(html_element);
                // }
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
                //Inserisco nel campo relativo della tab il numero dei risultati
                $("#series-tab .tot-result").text(data.total_results);
                //Conto il numero delle pagine e genero altrettanti bottoni in basso ai risultati
                var total_pages = data.total_pages;
                for (var i = 1; i <= total_pages; i++) {
                    //Inserisco i bottoni delle pagine con handlebars
                    var html_element = {
                        numero : i
                    };
                    var template_html = $("#page-button-template").html();
                    var template_function = Handlebars.compile(template_html);
                    var html_finale = template_function(html_element);
                    $("#series-page").append(html_finale);
                }

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
