// API Key: fa09d3b5c74a7a76d7a2fb0ef78d5662

var prevSearch = [];
$('#search-button').click(getLoc);

// function to get lat,lon coordinates while simultaneously allowing user to clarify city, state, country
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
            var cityOpt = $('<button></button>');
            
            if (data[i].state != undefined) {
              cityOpt.text(data[i].name + ', ' + data[i].state + ', ' + data[i].country).attr('data-lat', data[i].lat).attr('data-lon', data[i].lon).attr('id', 'city-option' + i).attr('class', 'm-1');
            } else {
              cityOpt.text(data[i].name + ', ' + data[i].country).attr('data-lat', data[i].lat).attr('data-lon', data[i].lon).attr('id', 'city-option' + i).attr('class', 'm-1'); 
            };

            $('#modal-list').append(cityOpt);
            };

            $('#modal').removeClass('d-none');
            $('[id*="city-option"]').click(selectCity);
        })
        .catch(err => {
            console.error(err);
        });    

}

$('#city-option0').click(function (){
    console.log('click');
});

function selectCity () {
    $('textarea').val('');
    $('#current-conditions').empty();
    var finalAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + $(this).data('lat') + '&lon=' + $(this).data('lon') + '&units=imperial&appid=fa09d3b5c74a7a76d7a2fb0ef78d5662'
    
    fetch(finalAPI)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var temp = $('<li>').text('Temp: ' + data.list[0].main.temp + '°F');
            var wind = $('<li>').text('Wind: ' + data.list[0].wind.speed + ' MPH');
            var humidity = $('<li>').text('Humdity: ' + data.list[0].main.humidity + '%');
            $('#city-name').text(data.city.name);
            $('#current-conditions').append(temp, wind, humidity);
        })
        .catch(err => {
            console.error(err);
        });

    var latitude = $(this).data('lat');
    var longitude = $(this).data('lon')
    var cityText = $(this).text();
    prevSearch.push( {latitude, longitude, cityText});
    localStorage.setItem('searchData', JSON.stringify(prevSearch));
    closeModal();


};

function closeModal () {
    $('#modal').addClass('d-none');
    $('#modal-list').empty();
};

$('#close').click(closeModal);
