import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/getAllAnimal')
      .then((res) => setAnimals(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ backgroundColor: '#7EB588', padding: '20px', minHeight: '100vh' }}>
      <div style={styles.headerWrapper}>
  <h1 style={styles.headerText}>Endangered Animal List</h1>
</div>
      {animals.map((animal, index) => {
        const isEven = index % 2 === 0;
        return (
          <div
            key={index}
            style={{
              ...styles.card,
              flexDirection: isEven ? 'row' : 'row-reverse',
            }}
          >
            <img
              src={`http://localhost:5000/${animal.image}`}
              alt={animal.name}
              style={styles.image}
            />
            <div style={styles.info}>
  <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#EFEEEE' }}>{animal.name}</h2>
  <p><strong>🛡️ Conservation Status:</strong> {animal.ConservationStatus}</p>
  <p><strong>📊 Estimated Population:</strong> {animal.EstimatedPopulationSize}</p>
  <p><strong>⚠️ Biggest Threat:</strong> {animal.BiggestThreat}</p>
  <p><strong>📍 Location:</strong> {animal.Location}</p>
  <p><strong>🌟 Feature:</strong> {animal.Feature}</p>
  <p><strong>📘 Fact:</strong> {animal.Fact}</p>
</div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center', 
    backgroundColor: '#0B653D',
    color: '#fff',
    borderRadius: '20px',
    marginBottom: '30px',
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  },
  image: {
    width: '50%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    padding: '40px',
    flex: 1,
    color: '#EFEFEF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '15px',
    fontSize: '1.1rem',
    lineHeight: '1.6',
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px',
  },
  
  headerText: {
    backgroundColor: '#0B653D',
    color: '#EFEEEE',
    padding: '15px 40px',
    borderRadius: '40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  },
};
export default AnimalList;
