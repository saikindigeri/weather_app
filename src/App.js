import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CityTable from './components/cityTable';
import WeatherPage from './components/WeatherPage';
import './App.css'
 
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CityTable />} />
        <Route path="/weather/:cityName" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
};

export default App;
