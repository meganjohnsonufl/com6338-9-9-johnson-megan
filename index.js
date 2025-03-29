var apiKey = '1b6ab7048b8d7d134f1e942e756497e5';

var form = document.querySelector('form');
var weatherSection = document.querySelector('#weather');
var weatherSearchInput = document.querySelector('#weather-search');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  var location = weatherSearchInput.value.trim();
  if (!location) return;

  weatherSection.innerHTML = '';

  var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&appid=' + apiKey;

  fetch(weatherURL)
    .then(function (response) {
      return response.json().then(function (data) {
        if (response.status === 404 || data.cod === '404') {
          weatherSection.innerHTML = '<h2>Location not found</h2>';
          weatherSearchInput.value = '';
          return;
        }
        return data;
      });
    })
    .then(function (data) {
      if (!data) return; // Exit if location was not found

      var name = data.name;
      var country = data.sys.country;
      var weather = data.weather;
      var temp = data.main.temp;
      var feels_like = data.main.feels_like;
      var dt = data.dt;
      var coord = data.coord;

      var weatherIcon = 'https://openweathermap.org/img/wn/' + (weather[0] ? weather[0].icon : '') + '@2x.png';
      var description = weather[0] ? weather[0].description : 'No description available';
      var lastUpdated = new Date(dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      var googleMapsLink = 'https://www.google.com/maps/search/?api=1&query=' + coord.lat + ',' + coord.lon;

      weatherSection.innerHTML =
        '<h2>' + name + ', ' + country + '</h2>' +
        '<a href="' + googleMapsLink + '" target="_blank">Click to view map</a>' +
        '<img src="' + weatherIcon + '" alt="' + description + '">' +
        '<p style="text-transform: capitalize;">' + description + '</p>' +
        '<p>Current: ' + temp + '° F</p>' +
        '<p>Feels like: ' + feels_like + '° F</p>' +
        '<p>Last updated: ' + lastUpdated + '</p>';

      weatherSearchInput.value = '';
    })
    .catch(function (error) {
      console.error('Error fetching weather data:', error);
      weatherSection.innerHTML = '<h2>Something went wrong. Please try again later.</h2>';
      weatherSearchInput.value = '';
    });
});
