/* eslint-disable no-unused-vars */
// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import NutriForm from './components/NutriForm';
import ResultsSection from './components/ResultsSection';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // const API_URL = import.meta.env.VITE_API_URL || 'https://nutriguide-api.onrender.com' ;
  const API_URL = 'https://nutriguide-backend-max6.onrender.com';

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from server');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-600 mb-2">NutriGuide</h1>
          <p className="text-lg text-gray-600">Your personalized nutrition assistant</p>
        </header>
        
        <NutriForm onSubmit={handleSubmit} loading={loading} />
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {results && <ResultsSection results={results} />}
      </div>
    </div>
  );
}

export default App;