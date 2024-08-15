import React, { useState, useEffect } from "react";
import '../styles/WeatherC.css'; // Adjust path as needed

const WeatherWidget = () => {
  const apiKey = '42ae5d5fe32aa654709605eba8c8786e';
  const city = 'Omaha';
  const countryCode = 'US';

  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Function to get the day of the week
  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  // Function to update the forecast display
  const displayForecastDay = (forecasts) => {
    if (forecasts.length === 0) return; // Ensure there are forecasts to display
    const forecastDay = forecasts[currentDayIndex];
    const temp = Math.ceil(forecastDay.main.temp); // Round up
    const icon = forecastDay.weather[0].icon;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // Update the forecast display
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = ''; // Clear previous content

    // Create a div for the current forecast
    const forecastDayDiv = document.createElement('div');
    forecastDayDiv.classList.add('forecast-day');

    // Create and append the forecast day name (day of the week)
    const forecastDayName = document.createElement('span');
    const dateStr = forecastDay.dt_txt; 
    forecastDayName.innerText = getDayOfWeek(dateStr); 
    forecastDayDiv.appendChild(forecastDayName); 

    // Create and append the forecast icon
    const forecastIcon = document.createElement('img');
    forecastIcon.src = weatherIconUrl;
    forecastDayDiv.appendChild(forecastIcon);

    // Create and append the forecast temperature
    const forecastTemp = document.createElement('span');
    forecastTemp.classList.add('forecast-temp');
    forecastTemp.innerText = `${temp}°F`;
    forecastDayDiv.appendChild(forecastTemp);

    // Append the forecast day div to the forecast element
    forecastElement.appendChild(forecastDayDiv);
  };

  useEffect(() => {
    // Fetch today's weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
      .then(response => response.json())
      .then(data => {
        setWeatherData(data);
      })
      .catch(error => console.error('Error fetching current weather:', error));

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
        // Get the forecast for the next 5 days, excluding today
        const today = new Date();
        const forecasts = data.list.filter(item => {
            const forecastDate = new Date(item.dt_txt);
            return forecastDate.getDate() > today.getDate() || (forecastDate.getDate() === today.getDate() && forecastDate.getHours() >= 12);
        });

        // We need to ensure we have the correct next 4 days
        const nextDaysForecast = [];
        let currentDay = today.getDate();
        for (let i = 0; i < forecasts.length; i++) {
            const forecastDate = new Date(forecasts[i].dt_txt);
            if (forecastDate.getDate() !== currentDay) {
                nextDaysForecast.push(forecasts[i]);
                currentDay = forecastDate.getDate();
            }
            // Stop after collecting 4 days
            if (nextDaysForecast.length === 4) break;
        }

        setForecast(nextDaysForecast); 
        displayForecastDay(nextDaysForecast); 

        // Set an interval to update the forecast display every 10 seconds
        const interval = setInterval(() => {
          setCurrentDayIndex((prevIndex) => (prevIndex + 1) % nextDaysForecast.length); 
          displayForecastDay(nextDaysForecast);
        }, 10000); // 10000 ms = 10 seconds

        return () => clearInterval(interval); // Cleanup on unmount
      })
      .catch(error => console.error('Error fetching 5-day forecast:', error));
  }, []); // Empty dependency array to run on mount

  useEffect(() => {
    if (forecast.length > 0) {
      displayForecastDay(forecast); 
    }
  }, [forecast, currentDayIndex]); 

  if (!weatherData) return <div>Loading...</div>;

  const temp = Math.ceil(weatherData.main.temp); 
  const weatherDescription = weatherData.weather[0].description;
  const icon = weatherData.weather[0].icon;
  const weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div id="weather-widget">
      <div id="today-weather">
        <h2>Today</h2>
        <img id="weather-icon" src={weatherIconUrl} alt="Weather Icon" />
        <div id="weather-temp-description">
          <div id="weather-temp">{temp}°F</div>
          <div id="weather-description">{weatherDescription}</div>
        </div>
      </div>
      <div id="forecast"></div>
    </div>
  );
};

export default WeatherWidget;
