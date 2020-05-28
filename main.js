

$(document).ready(function(){
    //Nascondo il contenitore dei risultati di ricerca
    $("#search-wrapper").hide();

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
        print_search_results();
    });

    //Cerco i risultati della ricerca alla pressione del tasto invio
    $("#search-header input").keyup(function() {
        if (event.which == 13) {
            print_search_results();
        };
    });

    //Cliccando sulle tab di ricerca, passo da film a serie tv e viceversa
    $(".result-tab").click(function(){
        //Verifico che il click non sia sulla tab attiva
        var clicked_tab = $(this);
        if (!clicked_tab.hasClass("active-tab")) {
            //Tolgo i vari active
            $(".active-tab").removeClass("active-tab");
            $(".active-wrapper").removeClass("active-wrapper");
            $(".active-page").removeClass("active-page");
            $(".active-btn").removeClass("active-btn");

            //Verifico se il click è su film o serie tv, e metto i vari active
            if (clicked_tab.attr("id") == "movie-tab") {
                $("#movie-tab").addClass("active-tab");
                $("#movie-wrapper").addClass("active-wrapper");
                $("#movie-wrapper .container[data-page=1]").addClass("active-page");
                $("#movie-page button:first-child").addClass("active-btn");
            } else {
                $("#series-tab").addClass("active-tab");
                $("#series-wrapper").addClass("active-wrapper");
                $("#series-wrapper .container[data-page=1]").addClass("active-page");
                $("#series-page button:first-child").addClass("active-btn");
            }
        }
    })

    //Cliccando sul numero di pagina passo alla relativa pagina di risultato
    $(document).on("click", "button.page-btn", function(){
        var bottone_cliccato = $(this);
        var numero_pagina_cliccata = bottone_cliccato.val();

        //Tolgo l'active dal precedente bottone della pagina e dalla pagina relativa
        $(".active-page").removeClass("active-page");
        $(".active-btn").removeClass("active-btn");

        //Applico la classe active al bottone cliccato e alla pagina relativa
        bottone_cliccato.addClass("active-btn");
        var select_test = $(".active-wrapper .container[data-page=" + numero_pagina_cliccata + "]");
        console.log(select_test);
        select_test.addClass("active-page");
    });
});


//FUNZIONI
//Funzione complessiva per procedere con la ricerca e per stampare i risultati in pagina(sia film che serie tv)
function print_search_results() {
    //Registro l'input dal campo search alla pressione del pulsante cerca
    var search_value = $("#search-header input").val();

    //Pulisco la pagina dai risultati di eventuali ricerche precedenti
    clear_results();

    //Procedo con la ricerca e la stampa dei risultati di film e serie tv
    find_movies(search_value);
    find_series(search_value);
};

//Funzione per aggiungere un genere ai filtri, tramite template Handlebars
function addGenreFilter(genere) {
    var template_html = $("#genre-filter-template").html();
    var html_element = {
        genere : genere
    };
    var template_function = Handlebars.compile(template_html);
    var html_finale = template_function(html_element);
    $("aside div.search-filter").append(html_finale);
};

//Funzione per pulire la pagina dai risultati, svuotando il campo di ricerca, contenitori, resettando i filtri e togliendo gli active
function clear_results() {
    //Svuoto il campo di ricerca
    $("#search-header input").val("");

    //Svuoto gli span nei tab con il numero di risultati totali
    $(".tot-results").text("");

    //Svuoto il contenitore con i bottoni per le pagine
    $(".page-counter").text("");

    //Tolgo le pagine dei risultati
    $("main .container").remove();

    //Azzero i filtri di ricerca
    $( 'input[type="checkbox"]' ).prop('checked', false);

    //Nascondo il contenitore dei risultati e toglo tutti gli active
    $("#search-wrapper").hide();
    $(".active-tab").removeClass("active-tab");
    $(".active-wrapper").removeClass("active-wrapper");
    $(".active-page").removeClass("active-page");
    $(".active-btn").removeClass("active-btn");
};

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
                $("#movie-tab .tot-result").text(data.total_results);
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
                                    //Creo un oggetto con i valori che mi interessano
                                    var html_element_card = {
                                        title : page_data.results[j].title,
                                        poster : page_data.results[j].poster_path,
                                        original_title : data.results[j].original_title,
                                        language : getFlags(page_data.results[j].original_language),
                                        rating : star_rating(page_data.results[j].vote_average)
                                    };
                                    //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                                    var template_html_card = $("#card-template").html();

                                    var template_function = Handlebars.compile(template_html_card);

                                    var html_finale_card = template_function(html_element_card);
                                    $("main .movies[data-page=" + page_data.page + "]").append(html_finale_card);
                                }
                            },
                        error : function() {
                            alert("Il cinema è chiuso");
                            }
                    })
                }

                //Rendo visibile il campo di ricerca. Di default metto attiva la tab dei film e la prima pagina dei RISULTATI
                $("#search-wrapper").show();
                $("#movie-tab").addClass("active-tab");
                $("#movie-wrapper").addClass("active-wrapper");
                $("#movie-wrapper .container[data-page=1]").addClass("active-page");
                $("#movie-page button:first-child").addClass("active-btn");
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
                    $("#series-page").append(html_finale);

                    //Genero la scheda risultati relativa alla pagina
                    var html_element_page = {
                        tipo : "series",
                        pagina : current_page
                    };
                    var template_html = $("#page-template").html();
                    var template_function = Handlebars.compile(template_html);
                    var html_finale = template_function(html_element_page);
                    $("#series-wrapper").append(html_finale);

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
                                    //Creo un oggetto con i valori che mi interessano
                                    var html_element_card = {
                                        title : page_data.results[j].name,
                                        poster : page_data.results[j].poster_path,
                                        original_title : data.results[j].original_name,
                                        language : getFlags(page_data.results[j].original_language),
                                        rating : star_rating(page_data.results[j].vote_average)
                                    };
                                    //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                                    var template_html_card = $("#card-template").html();

                                    var template_function = Handlebars.compile(template_html_card);

                                    var html_finale_card = template_function(html_element_card);
                                    $("main .series[data-page=" + page_data.page + "]").append(html_finale_card);
                                }
                            },
                        error : function() {
                            alert("Il cinema è chiuso");
                            }
                    })
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

//Funzione per stampare le bandierine della lingua originale
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
