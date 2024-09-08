

import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';


const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]); // For filtered search results
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch cities based on the current page (for infinite scroll)
  const fetchCities = async () => {
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&rows=20&start=${page}`
      );
      const data = await response.json();

      setCities((prev) => [...prev, ...data.records]);
      setFilteredCities((prev) => [...prev, ...data.records]); // Set filtered cities initially

      // Stop fetching if there are no more records
      if (data.records.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Load initial cities on component mount and on page increment
  useEffect(() => {
    fetchCities();
  }, [page]);

  // Search as you type - Filter local city list
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCities(cities); // Reset to all cities if search is cleared
    } else {
      const filtered = cities.filter((city) =>
        city.fields.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, cities]);

  // Sorting functionality
  const sortCities = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCities = [...filteredCities].sort((a, b) => {
      if (a.fields[key] < b.fields[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a.fields[key] > b.fields[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredCities(sortedCities);
  };

  return (
    <div className='whole'>
      <input className='search-bar'
        type="text"
        placeholder="Search city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <InfiniteScroll
        dataLength={filteredCities.length} // Update length based on filtered cities
        next={() => setPage(page + 20)} // Fetch more cities
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th onClick={() => sortCities('name')}>
                City Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => sortCities('country')}>
                Country {sortConfig.key === 'country' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => sortCities('timezone')}>
                Timezone {sortConfig.key === 'timezone' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/weather/${city.fields.name}`}>
                    {city.fields.name}
                  </Link>
                </td>
                <td>{city.fields.label_en}</td>
                <td>{city.fields.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default CityTable;
