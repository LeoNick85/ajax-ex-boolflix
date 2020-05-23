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
            console.log(data);
        },
        error : function() {
            alert("Il cinema è chiuso");
        }
    })
    })

})
