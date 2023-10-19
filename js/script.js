// API Key: fa09d3b5c74a7a76d7a2fb0ef78d5662

var prevSearch = [];
const today = dayjs();

const days = [8, 16, 24, 32];
const cards = ['#date1', '#date2', '#date3', '#date4'];

$(function () {
// function to get lat,lon coordinates while simultaneously allowing user to clarify city, state, country
    $('#search-button').click(function () { 
        var apiURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + $('#search-field').val() +'&limit=5&appid=fa09d3b5c74a7a76d7a2fb0ef78d5662'

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
                    cityOpt.text(data[i].name + ', ' + data[i].state + ', ' + data[i].country).attr('data-lat', data[i].lat).attr('data-lon', data[i].lon).attr('id', 'city-option' + i).attr('class', 'btn border-rounded bg-secondary m-2');
                    } else {
                    cityOpt.text(data[i].name + ', ' + data[i].country).attr('data-lat', data[i].lat).attr('data-lon', data[i].lon).attr('id', 'city-option' + i).attr('class', 'btn border-rounded bg-secondary m-2'); 
                    };

                    $('#modal-list').append(cityOpt);
                };

                $('#modal').removeClass('d-none');
                $('[id*="city-option"]').click(selectCity);
                $('#close').click(closeModal);
            })
            .catch(err => {
                console.error(err);
            });    
    });

    // run API for specifically selected location (using lon,lat to specify)
    function selectCity (event) {
        event.stopPropagation();

        $('#current-conditions').empty();
        var finalAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + $(this).data('lat') + '&lon=' + $(this).data('lon') + '&units=imperial&appid=fa09d3b5c74a7a76d7a2fb0ef78d5662'
        
        fetch(finalAPI)
            .then (function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                var png = data.list[0].weather[0].icon
                var temp = $('<li>').text('Temp: ' + data.list[0].main.temp + '°F');
                var wind = $('<li>').text('Wind: ' + data.list[0].wind.speed + ' MPH');
                var humidity = $('<li>').text('Humdity: ' + data.list[0].main.humidity + '%');
                var outlook = [
                    {
                    dateF: today.add(1, 'days').format('MM/DD/YY'),
                    iconF: data.list[8].weather[0].icon,
                    tempF: data.list[8].main.temp,
                    windF: data.list[8].wind.speed,
                    humidF: data.list[8].main.humidity,
                }, {
                    dateF: today.add(2, 'days').format('MM/DD/YY'),
                    iconF: data.list[16].weather[0].icon,
                    tempF: data.list[16].main.temp,
                    windF: data.list[16].wind.speed,
                    humidF: data.list[16].main.humidity,
                }, {
                    dateF: today.add(3, 'days').format('MM/DD/YY'),
                    iconF: data.list[24].weather[0].icon,
                    tempF: data.list[24].main.temp,
                    windF: data.list[24].wind.speed,
                    humidF: data.list[24].main.humidity,
                }, {
                    dateF: today.add(4, 'days').format('MM/DD/YY'),
                    iconF: data.list[32].weather[0].icon,
                    tempF: data.list[32].main.temp,
                    windF: data.list[32].wind.speed,
                    humidF: data.list[32].main.humidity,
                }
                ];
                            
                $('#city-name').text(data.city.name + ' ' + today.format('MM/DD/YY'));
                $('#current-city').children('img').attr('src', 'https://openweathermap.org/img/wn/' + png + '@2x.png')
                $('#current-conditions').append(temp, wind, humidity);
                
                for (i=0; i<5; i++) {
                    $(cards[i]).children('div').text('');
                    $(cards[i]).children('ul').empty();

                    var img = 'https://openweathermap.org/img/wn/' + outlook[i].iconF + '@2x.png';

                    $(cards[i]).children('div').text(outlook[i].dateF);
                    $(cards[i]).children('img').attr('src', img);
                    $(cards[i]).children('ul').append($('<li>').text('Temp: ' + outlook[i].tempF + '°F'));
                    $(cards[i]).children('ul').append($('<li>').text('Wind: ' + outlook[i].windF+ 'MPH'));
                    $(cards[i]).children('ul').append($('<li>').text('Humidity: ' + outlook[i].humidF+ '%'));
                }
            })
            .catch(err => {
                console.error(err);
            });

        var latitude = $(this).data('lat');
        var longitude = $(this).data('lon')
        var cityText = $(this).text();
        prevSearch.push( {latitude, longitude, cityText});
        localStorage.setItem('searchData', JSON.stringify(prevSearch));
        cityList();
        closeModal();

    };

    // function to fill list of most 10 most recently viewed cities
    function cityList (){
        $('#city-list').empty()

        var storedCities = JSON.parse(localStorage.getItem('searchData'));

        if (storedCities !== null) {
            prevSearch = storedCities.slice(-10);
            console.log(prevSearch);

            for(var i = prevSearch.length -1; i >= 0; i-- ){
                if (i >= 0) {
                    var cityBtn = $('<button>').text(prevSearch[i].cityText).attr('id', 'stored-city' + i).attr('class', "btn w-100 m-1 border-rounded btn bg-secondary").attr('data-lat', prevSearch[i].latitude).attr('data-lon', prevSearch[i].longitude);

                    $('#city-list').append(cityBtn);
                };

            };
            
            // click event to display previously searched city forecasts
            $('[id*="stored-city"]').click(function (event) {
                event.stopPropagation();
                event.preventDefault();
                $('#current-conditions').empty();
                var finalAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + $(this).data('lat') + '&lon=' + $(this).data('lon') + '&units=imperial&appid=fa09d3b5c74a7a76d7a2fb0ef78d5662'
                
                fetch(finalAPI)
                    .then (function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        var png = data.list[0].weather[0].icon
                        var temp = $('<li>').text('Temp: ' + data.list[0].main.temp + '°F');
                        var wind = $('<li>').text('Wind: ' + data.list[0].wind.speed + ' MPH');
                        var humidity = $('<li>').text('Humdity: ' + data.list[0].main.humidity + '%');
                        var outlook = [
                            {
                            dateF: today.add(1, 'days').format('MM/DD/YY'),
                            iconF: data.list[8].weather[0].icon,
                            tempF: data.list[8].main.temp,
                            windF: data.list[8].wind.speed,
                            humidF: data.list[8].main.humidity,
                        }, {
                            dateF: today.add(2, 'days').format('MM/DD/YY'),
                            iconF: data.list[16].weather[0].icon,
                            tempF: data.list[16].main.temp,
                            windF: data.list[16].wind.speed,
                            humidF: data.list[16].main.humidity,
                        }, {
                            dateF: today.add(3, 'days').format('MM/DD/YY'),
                            iconF: data.list[24].weather[0].icon,
                            tempF: data.list[24].main.temp,
                            windF: data.list[24].wind.speed,
                            humidF: data.list[24].main.humidity,
                        }, {
                            dateF: today.add(4, 'days').format('MM/DD/YY'),
                            iconF: data.list[32].weather[0].icon,
                            tempF: data.list[32].main.temp,
                            windF: data.list[32].wind.speed,
                            humidF: data.list[32].main.humidity,
                        }
                        ];
                                    
                        $('#city-name').text(data.city.name + ' ' + today.format('MM/DD/YY'));
                        $('#current-city').children('img').attr('src', 'https://openweathermap.org/img/wn/' + png + '@2x.png')
                        $('#current-conditions').append(temp, wind, humidity);
                        
                        for (i=0; i<5; i++) {
                            $(cards[i]).children('div').text('');
                            $(cards[i]).children('ul').empty();

                            var img = 'https://openweathermap.org/img/wn/' + outlook[i].iconF + '@2x.png';

                            $(cards[i]).children('div').text(outlook[i].dateF);
                            $(cards[i]).children('img').attr('src', img);
                            $(cards[i]).children('ul').append($('<li>').text('Temp: ' + outlook[i].tempF + '°F'));
                            $(cards[i]).children('ul').append($('<li>').text('Wind: ' + outlook[i].windF+ 'MPH'));
                            $(cards[i]).children('ul').append($('<li>').text('Humidity: ' + outlook[i].humidF+ '%'));
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });

                });   
        } else return;
    };



    // function to close modal when city is selected or close button is selected
    function closeModal () {
        $('#modal').addClass('d-none');
        $('#modal-list').empty();
        $('textarea').val('');
    };

    cityList ();
});