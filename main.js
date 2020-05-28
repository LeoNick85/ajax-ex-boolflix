var genre_list = [];

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
                    addGenreFilter(data.genres[i]);
                }

                genre_list = data.genres;

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
    });

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
        select_test.addClass("active-page");
    });

    //Cliccando su una card apro un contenitore in overlay con i dettagli del FILM/serie
    $(document).on("click", ".flip-card", function(){
        var clicked_card = $(this);
        getDetails(clicked_card);
    });

    //Cliccando sulla X dell'overlay lo chiudo
    $(document).on("click", ".fa-window-close", function(){
        $(".element-detail").remove();
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
        genre_id : genere.id,
        genere : genere.name
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
                                    //Salvo gli elementi che mi interessano in specifiche variabili
                                    var new_card_id = page_data.results[j].id;
                                    var new_title = page_data.results[j].title;
                                    if (page_data.results[j].poster_path == null) {
                                        var new_poster = "img/cinema.jpg";
                                    } else {
                                        var new_poster = "https://image.tmdb.org/t/p/w185" + page_data.results[j].poster_path;
                                    }
                                    var new_original_title = data.results[j].original_title;
                                    var new_language = getFlags(page_data.results[j].original_language);
                                    var new_rating = star_rating(page_data.results[j].vote_average);
                                    var new_genre = genreToString(page_data.results[j].genre_ids)

                                    //Creo un oggetto con i valori che mi interessano
                                    var html_element_card = {
                                        card_id : new_card_id,
                                        title : new_title,
                                        poster : new_poster,
                                        original_title : new_original_title,
                                        language : new_language,
                                        rating : new_rating,
                                        genre_card : new_genre,
                                        type : "movie"
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
};

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
                        url : "https://api.themoviedb.org/3/search/tv",
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
                                    //Salvo gli elementi che mi interessano in specifiche variabili
                                    var new_card_id = page_data.results[j].id;
                                    var new_title = page_data.results[j].name;
                                    if (page_data.results[j].poster_path == null) {
                                        var new_poster = "img/cinema.jpg";
                                    } else {
                                        var new_poster = "https://image.tmdb.org/t/p/w185" + page_data.results[j].poster_path;
                                    }
                                    var new_original_title = data.results[j].original_name;
                                    var new_language = getFlags(page_data.results[j].original_language);
                                    var new_rating = star_rating(page_data.results[j].vote_average);
                                    var new_genre = genreToString(page_data.results[j].genre_ids)

                                    //Creo un oggetto con i valori che mi interessano
                                    var html_element_card = {
                                        card_id : new_card_id,
                                        title : new_title,
                                        poster : new_poster,
                                        original_title : new_original_title,
                                        language : new_language,
                                        rating : new_rating,
                                        genre_card : new_genre,
                                        type : "tv"
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
};

//Funzione per fare una string coi generi a partire dagli // IDEA:
function genreToString(genre_id) {
    var genre_array = [];
    for (var i = 0; i < genre_id.length; i++) {
        for (var j = 0; j < genre_list.length; j++) {
            if (genre_list[j].id == genre_id[i]) {
                genre_array.push(genre_list[j].name)
                var genre_string = genre_array.join(", ");
                // genre_array.push(genre_list[j].name)
            };
        };
    };
    return genre_string;
};

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

//Funzione per creare overlay coi dettagli
function getDetails(card) {
    //Verifico se è un film o una serie
    var card_type = card.attr("data-card-type");
    var current_card_id = card.attr("data-card-id");

    if (card_type == "movie") {
        var detail_url = "https://api.themoviedb.org/3/movie/" + current_card_id;
        //Faccio chiamata ajax via id per film
        $.ajax({
            url : detail_url,
            method : "GET",
            data : {
                api_key : "fc16baf9f9f37096b14c800ebf114a8a",
                language : "it"
                },
            success: function(data) {
                var cast_array = [];
                var cast_url = "https://api.themoviedb.org/3/movie/" + current_card_id + "/credits"
                var detail_data = data;

                $.ajax({
                    url : cast_url,
                    method : "GET",
                    data : {
                        api_key : "fc16baf9f9f37096b14c800ebf114a8a",
                        language : "it"
                        },
                    success: function(data) {
                            for (var i = 0; (i < data.cast.length) && (i < 5); i++) {
                                cast_array.push(data.cast[i].name);
                            }

                            console.log(cast_array);


                            //Salvo gli elementi che mi interessano in specifiche variabili
                            var new_title = detail_data.title;
                            if (detail_data.overview == "") {
                                var new_preview = "Nessuna descrizione";
                            } else {
                                var new_preview = detail_data.overview;
                            }
                            if (detail_data.poster_path == null) {
                                var new_poster = "img/cinema.jpg";
                            } else {
                                var new_poster = "https://image.tmdb.org/t/p/w342" + detail_data.poster_path;
                            }
                            var new_original_title = detail_data.original_title;
                            var new_language = detail_data.original_language;
                            var new_year = detail_data.release_date;
                            var new_genre = [];
                            for (var i = 0; i < detail_data.genres.length; i++) {
                                new_genre.push(detail_data.genres[i].name);
                            }
                            var new_cast = cast_array;

                            //Genero l'overlay con handlebars
                            var html_element = {
                                title : new_title,
                                preview: new_preview,
                                original_title: new_original_title,
                                original_language : new_language,
                                poster_url : new_poster,
                                genre : new_genre.join(", "),
                                year : new_year,
                                cast : new_cast.join(", ")
                            };

                            var template_html = $("#detail-template").html();
                            var template_function = Handlebars.compile(template_html);
                            var html_finale = template_function(html_element);
                            $("main").append(html_finale);
                        },
                    error : function() {
                        alert("Error: Genres");
                        }
                })

                },
            error : function() {
                alert("Error: Genres");
                }
        })
    } else {
        var detail_url = "https://api.themoviedb.org/3/tv/" + current_card_id;
        //Faccio chiamata ajax via id per film
        $.ajax({
            url : detail_url,
            method : "GET",
            data : {
                api_key : "fc16baf9f9f37096b14c800ebf114a8a",
                language : "it"
                },
            success: function(data) {
                var cast_array = [];
                var cast_url = "https://api.themoviedb.org/3/tv/" + current_card_id + "/credits"
                var detail_data = data;

                $.ajax({
                    url : cast_url,
                    method : "GET",
                    data : {
                        api_key : "fc16baf9f9f37096b14c800ebf114a8a",
                        language : "it"
                        },
                    success: function(data) {
                            for (var i = 0; (i < data.cast.length) && (i < 5); i++) {
                                cast_array.push(data.cast[i].name);
                            }

                            console.log(cast_array);


                            //Salvo gli elementi che mi interessano in specifiche variabili
                            var new_title = detail_data.name;
                            if (detail_data.overview == "") {
                                var new_preview = "Nessuna descrizione";
                            } else {
                                var new_preview = detail_data.overview;
                            }
                            if (detail_data.poster_path == null) {
                                var new_poster = "img/cinema.jpg";
                            } else {
                                var new_poster = "https://image.tmdb.org/t/p/w342" + detail_data.poster_path;
                            }
                            var new_original_title = detail_data.original_name;
                            var new_language = detail_data.original_language;
                            var new_year = detail_data.first_air_date;
                            var new_genre = [];
                            for (var i = 0; i < detail_data.genres.length; i++) {
                                new_genre.push(detail_data.genres[i].name);
                            }
                            var new_cast = cast_array;

                            //Genero l'overlay con handlebars
                            var html_element = {
                                title : new_title,
                                preview: new_preview,
                                original_title: new_original_title,
                                original_language : new_language,
                                poster_url : new_poster,
                                genre : new_genre.join(", "),
                                year : new_year,
                                cast : new_cast.join(", ")
                            };

                            var template_html = $("#detail-template").html();
                            var template_function = Handlebars.compile(template_html);
                            var html_finale = template_function(html_element);
                            $("main").append(html_finale);
                        },
                    error : function() {
                        alert("Error: Genres");
                        }
                })

                },
            error : function() {
                alert("Error: Genres");
                }
        })
    }
};

//Funzione per creare un array con i primi 5 elementi del cast
function getCast(type, id) {
    var cast_array = [];
    var cast_url = "https://api.themoviedb.org/3/" + type + "/" + id + "/credits"

    $.ajax({
        url : cast_url,
        method : "GET",
        data : {
            api_key : "fc16baf9f9f37096b14c800ebf114a8a",
            language : "it"
            },
        success: function(data) {
                for (var i = 0; (i < data.cast.length) && (i < 5); i++) {
                    cast_array.push(data.cast[i].name);
                }

                console.log(cast_array);
                return cast_array;
            },
        error : function() {
            alert("Error: Genres");
            }
    })
}
