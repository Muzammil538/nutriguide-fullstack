// src/components/ResultsSection.jsx
import { useState } from 'react';
import DietCompositionChart from './DietCompositionChart';

const ResultsSection = ({ results }) => {
  const [speaking, setSpeaking] = useState(false);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const speakResults = () => {
    const textToSpeak = `
      Your BMI is ${results.bmi}.
      ${results.bmi_category}.
      Here's some motivation: ${results.motivation}.
      Your meal plan for today includes:
      ${results.meal_plan.map(meal => `${meal.time}: ${meal.food}, ${meal.quantity}`).join('. ')}
    `;

    speakText(textToSpeak);
  };

  const getBMIColorClass = (bmi) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Personalized Meal Plan</h2>

        <div className="space-y-4">
          { results.meal_plan.map((meal, index) => (
            <div key={ index } className="bg-blue-50 rounded-md p-4 flex items-center border-l-4 border-blue-500">
              <div className="w-24 font-medium text-blue-800">{ meal.time }</div>
              <div className="flex-1">
                <div className="font-medium">{ meal.food }</div>
                <div className="text-sm text-gray-600">{ meal.quantity }</div>
              </div>
            </div>
          )) }
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Your Results</h2>

          { speaking ? (
            <button
              onClick={ stopSpeaking }
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M6 18L18 6M6 6l12 12" />
              </svg>
              Stop Speaking
            </button>
          ) : (
            <button
              onClick={ speakResults }
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Read Results
            </button>
          ) }
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">BMI</h3>
            <p className={ `text-3xl font-bold ${getBMIColorClass(results.bmi)}` }>
              { results.bmi }
            </p>
            <p className="text-gray-600 mt-1">{ results.bmi_category }</p>
          </div>

          <div className="md:col-span-2 bg-green-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Motivation</h3>
            <p className="text-green-800 italic">{ results.motivation }</p>
          </div>
        </div>
      </div>

      {/* Updated to pass the BMI value directly to the DietCompositionChart */ }
      <DietCompositionChart bmi={ results.bmi } API_URL={ import.meta.env.VITE_API_URL || 'http://localhost:5000' } />


    </div>
  );
};

export default ResultsSection;