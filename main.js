// Predisporre quindi un layout molto semplice con una barra di ricerca e un pulsante: al click sul pulsante fare partire una chiamata ajax a tmdb per recuperare i film che corrispondo alla query di ricerca inserita dall'utente.
// Ciclare i risultati e per ogni film restituito, stamparne in pagina:
// titolo
// titolo originale
// lingua
// voto

$(document).ready(function(){
    //Registro l'input dal campo search alla pressione del pulsante cerca
    $("#search-header button").click(function() {
        var search_value = $("#search-header input").val();

        //Svuoto il campo di ricerca
        $("#search-header input").val("");
        console.log(search_value);

        //Procedo con la chiamata ajax con la ricerca dell'utente
        $.ajax({
            url : "https://api.themoviedb.org/3/search/movie",
            method : "GET",
            data : {
                api_key : "fc16baf9f9f37096b14c800ebf114a8a",
                language : "it",
                page : 1,
                query : search_value
                },
            success: function(data) {
                    //Svuoto l'html nel campo dei risultati
                    $("main .container").text("");
                    //Inserisco nel campo dei risultati una stringa con il numero dei risultati
                    $("main .container").append("<p>Il numero dei risultati è: " + data.results.length);

                    //Utilizzo la risposta dell'ajax per stampare in serie titolo,  titolo originale, lingua, voto
                    for (var i = 0; i < data.results.length; i++) {
                        //Creo un oggetto con i valori che mi interessano
                        var html_element = {
                            title : data.results[i].title,
                            original_title : data.results[i].original_title,
                            language : data.results[i].original_language,
                            rating : data.results[i].vote_average
                        };

                        //Creo un nuovo elemento con handlebars e lo inserisco in pagina
                        var template_html = $("#movie-result-template").html();

                        var template_function = Handlebars.compile(template_html);

                        var html_finale = template_function(html_element);
                        $("main .container").append(html_finale);
                        console.log(html_element);
                    }
                },
            error : function() {
                alert("Il cinema è chiuso");
                }
        })
    })

})
