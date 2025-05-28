import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DietCompositionChart = ({ bmi, API_URL }) => {
  const [dietData, setDietData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/nutrition_composition`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bmi }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition data');
        }
        
        const data = await response.json();
        setDietData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching nutrition data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bmi) {
      fetchNutritionData();
    }
  }, [bmi, API_URL]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
        <p>Loading nutrition analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p className="text-red-600">Error loading nutrition data: {error}</p>
      </div>
    );
  }

  if (!dietData) return null;

  // Format data for charts
  const unbalancedDietData = [
    { name: 'Carbs', value: dietData.composition.carbs, color: '#3b82f6' },
    { name: 'Proteins', value: dietData.composition.proteins, color: '#f97316' },
    { name: 'Fats', value: dietData.composition.fats, color: '#65a30d' },
    { name: 'Vitamins', value: dietData.composition.vitamins, color: '#dc2626' },
    { name: 'Minerals', value: dietData.composition.minerals, color: '#a855f7' },
  ];

  const balancedDietData = [
    { name: 'Carbs', value: 30, color: '#3b82f6' },
    { name: 'Proteins', value: 30, color: '#f97316' },
    { name: 'Fats', value: 20, color: '#65a30d' },
    { name: 'Vitamins', value: 10, color: '#dc2626' },
    { name: 'Minerals', value: 10, color: '#a855f7' },
  ];

  // Custom render for the label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${value.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Diet Composition Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl text-center font-medium text-gray-700 mb-4">
            Unbalanced Diet
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unbalancedDietData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {unbalancedDietData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl text-center font-medium text-gray-700 mb-4">
            Balanced Diet
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={balancedDietData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {balancedDietData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
        <h4 className="font-medium text-blue-800 mb-2">Nutrition Insight</h4>
        <p className="text-gray-700">
          {dietData.recommendation}
        </p>
      </div>
    </div>
  );
};

export default DietCompositionChart;