// API Key: fa09d3b5c74a7a76d7a2fb0ef78d5662


$('#search-button').click(getLoc);

function getLoc () {
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + $('#search-field').val() +'&limit=5&appid=fa09d3b5c74a7a76d7a2fb0ef78d5662'

    console.log(apiURL);

    fetch(apiURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            for (var i=0; i<data.length; i++) {
            var cityOpt = $('<button></button>').text(data[i].name + ', ' + data[i].state + ', ' + data[i].country).attr('data-lat', data[i].lat).attr('data-lon', data[i].lon).attr('id', 'city-option' + i).attr('class', 'm-1');

            $('#modal-list').append(cityOpt);

            console.log(cityOpt);
            };

            $('#modal').removeClass('d-none');

            console.log($('#city-option1').data('lon'));
        })
        .catch(err => {
            console.error(err);
        });

        

}




function closeModal () {
    $('#modal').addClass('d-none');
}

$('#close').click(closeModal);