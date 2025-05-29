import React from 'react';

// Placeholder Icon - replace with actual SVG or react-icons component
const TourismIcon = () => (
  <svg className="w-8 h-8 text-mygreen dark:text-mygreen-light" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>{/* Simplified location pin */}
  </svg>
);

const EcoSitePressureCard = ({ prediction }) => {
  if (!prediction) return null;

  const { 
    siteName = "N/A", 
    predictionDate,
    expectedVisitorLoad = "N/A",
    confidenceScore,
    contributingFactors,
    recommendation
  } = prediction;

  let loadColorClass = "text-gray-700 dark:text-gray-300";
  let loadBgClass = "bg-gray-100 dark:bg-gray-600";

  switch (expectedVisitorLoad?.toLowerCase()) {
    case 'high':
      loadColorClass = "text-red-700 dark:text-red-400";
      loadBgClass = "bg-red-100 dark:bg-red-700/30";
      break;
    case 'moderate':
      loadColorClass = "text-yellow-700 dark:text-yellow-400";
      loadBgClass = "bg-yellow-100 dark:bg-yellow-700/30";
      break;
    case 'low':
      loadColorClass = "text-green-700 dark:text-green-400";
      loadBgClass = "bg-green-100 dark:bg-green-700/30";
      break;
    default:
      break;
  }

  return (
    <div className="bg-white dark:bg-env-gray-dark rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{siteName}</h3>
          <div className={`p-2 rounded-full ${loadBgClass} ml-2`}>
            <TourismIcon /> {/* Placeholder Icon */}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Expected Visitor Load:</p>
          <p className={`text-2xl font-bold ${loadColorClass}`}>{expectedVisitorLoad}</p>
        </div>

        {predictionDate && 
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Forecast for: {new Date(predictionDate).toLocaleDateString()} {new Date(predictionDate).toLocaleTimeString()}
          </p>
        }
        {confidenceScore && 
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Confidence: {(confidenceScore * 100).toFixed(0)}%
          </p>
        }
      </div>

      <div className="mt-auto pt-3">
        {contributingFactors && contributingFactors.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Factors:</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{contributingFactors.join(', ')}</p>
          </div>
        )}
        {recommendation && (
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Tip:</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoSitePressureCard; 