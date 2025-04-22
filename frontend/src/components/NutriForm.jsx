// src/components/NutriForm.jsx
import { useState } from 'react';

const NutriForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    bp: 'normal',
    glucose: 'normal',
    hydration: 'moderate',
    stress: 'low',
    day: 'monday',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="100"
              max="250"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="175"
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="30"
              max="250"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="70"
            />
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age (years)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="35"
            />
          </div>
          
          <div>
            <label htmlFor="bp" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure
            </label>
            <select
              id="bp"
              name="bp"
              value={formData.bp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="normal">Normal</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="glucose" className="block text-sm font-medium text-gray-700 mb-1">
              Glucose Level
            </label>
            <select
              id="glucose"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="normal">Normal</option>
              <option value="low">Low</option>
              <option value="high">High (Diabetic)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="hydration" className="block text-sm font-medium text-gray-700 mb-1">
              Hydration Level
            </label>
            <select
              id="hydration"
              name="hydration"
              value={formData.hydration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="stress" className="block text-sm font-medium text-gray-700 mb-1">
              Stress Level
            </label>
            <select
              id="stress"
              name="stress"
              value={formData.stress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
              Day / Special Condition
            </label>
            <select
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
              <option value="ulcer">Gastric Ulcer</option>
              <option value="fasting">Fasting</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 rounded-md transition duration-300 flex items-center justify-center"
        >
          {loading ? (
            <span className="inline-block animate-pulse">Processing...</span>
          ) : (
            'Get Your Personalized Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default NutriForm;