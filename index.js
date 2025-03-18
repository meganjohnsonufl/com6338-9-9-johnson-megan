const apiKey = '1b6ab7048b8d7d134f1e942e756497e5';

const form = document.querySelector('form');
const weatherSection = document.querySelector('#weather');
const weatherSearchInput = document.querySelector('#weather-search');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const location = weatherSearchInput.value.trim();
  if (!location) return;

  weatherSection.innerHTML = '';

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(weatherURL);

    if (response.status === 404) {
      weatherSection.innerHTML = '<h2>Location not found</h2>';
      weatherSearchInput.value = '';
      return;
    }

    const data = await response.json();

    const { 
      name, 
      sys: { country }, 
      weather, 
      main: { temp, feels_like }, 
      dt, 
      coord 
    } = data;

    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0]?.icon}@2x.png`;
    const description = weather[0]?.description || 'No description available';
    const lastUpdated = new Date(dt * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`;

    weatherSection.innerHTML = `
      <h2>${name}, ${country}</h2>
      <a href="${googleMapsLink}" target="_blank">Click to view map</a>
      <img src="${weatherIcon}" alt="${description}">
      <p style="text-transform: capitalize;">${description}</p>
      <p>Current: ${temp}° F</p>
      <p>Feels like: ${feels_like}° F</p>
      <p>Last updated: ${lastUpdated}</p>
    `;
    
    weatherSearchInput.value = '';

  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherSection.innerHTML = '<h2>Something went wrong. Please try again later.</h2>';
    weatherSearchInput.value = '';
  }
});