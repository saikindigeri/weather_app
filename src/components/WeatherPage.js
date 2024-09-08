

import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

const WeatherPage = () => {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); 
  const [forecast, setForecast] = useState(null); 
  const API_KEY = '47049229f9607305229c8a0cbbe3085b';


  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    };
    fetchWeather();
  }, [cityName, unit]);


  useEffect(() => {
    const fetchForecast = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      const data = await response.json();
      setForecast(data);
    };
    fetchForecast();
  }, [cityName, unit]);


  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  if (!weather || !forecast) return <div>Loading...</div>;


const weatherCondition = weather.weather[0].main.toLowerCase();

let backgroundClass = '';
if (weatherCondition.includes('clear')) {
  backgroundClass = 'sunny';
} else if (weatherCondition.includes('rain')) {
  backgroundClass = 'rainy';
} else if (weatherCondition.includes('cloud')) {
  backgroundClass = 'cloudy';
}


return (
  <div className={`container ${backgroundClass}`}>
    <h2>Weather in {weather.name}</h2>
    <button onClick={toggleUnit}>
      Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
    </button>
    <div className="weather-info">
      <div className="weather-card">
        <p>Temperature: {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
        <p>High: {weather.main.temp_max}°</p>
        <p>Low: {weather.main.temp_min}°</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind Speed: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
      </div>

    </div>
  </div>
);

};

export default WeatherPage;
