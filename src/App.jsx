import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [donors, setDonors] = useState([]);
  const [filterGroup, setFilterGroup] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        
        const bloodGroups = ["A+", "B+", "O-", "AB+", "O+", "A-", "B-"];
        
        // Map the real data and add a random blood group to each person
        const donorsWithGroups = data.map(user => ({
          ...user,
          bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)]
        }));

        setDonors(donorsWithGroups);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  return (
    <div className="App">
      <h1>🩸 Community Blood Donor Finder</h1>

      <div className="filter-container">
        <div className="filter-group">
          <label>Blood Group:</label>
          <select onChange={(e) => setFilterGroup(e.target.value)}>
            <option value="">All Groups</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="O+">O+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search City:</label>
          <input 
            type="text" 
            placeholder="e.g. London..." 
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading donors...</p>
      ) : (
        <div className="donor-list">
          {donors
            .filter(donor => filterGroup === "" || donor.bloodGroup === filterGroup)
            .filter(donor => donor.address.city.toLowerCase().includes(searchCity.toLowerCase()))
            .map(donor => (
              <div key={donor.id} className="donor-card">
                <div className="card-header">
                  <h3>{donor.name}</h3>
                  <span className="blood-badge">{donor.bloodGroup}</span>
                </div>
                
                <p>📍 <strong>City:</strong> {donor.address.city}</p>
                <p>📧 <strong>Email:</strong> {donor.email.toLowerCase()}</p>
                <p>📞 <strong>Phone:</strong> {donor.phone}</p>
                <p>🏢 <strong>Company:</strong> {donor.company.name}</p>

                <button onClick={() => alert(`Emergency request sent to ${donor.name}!`)}>
                  Request Help
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default App