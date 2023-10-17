// API Key: fa09d3b5c74a7a76d7a2fb0ef78d5662


$('#search-button').click(getAPI);

function getAPI () {
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + $('#search-field').val() +'&limit=5&appid=fa09d3b5c74a7a76d7a2fb0ef78d5662'

    console.log(apiURL);

    fetch(apiURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });

}