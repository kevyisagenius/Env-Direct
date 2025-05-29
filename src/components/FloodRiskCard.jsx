import React from 'react';

// Placeholder Icon - replace with actual SVG or react-icons component
const FloodIcon = () => (
  <svg className="w-8 h-8 text-mygreen dark:text-mygreen-light" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M20.354 15.354l-2.353-2.353m0 0A4.5 4.5 0 0015.5 8.5H10V4M9 9L4.646 4.646M3 3l18 18"></path> {/* Simplified wave/water icon */}
    <path d="M9.5 13.5c0 .965.184 1.894.513 2.75M18.5 9.75A4.5 4.5 0 0014.5 6h-2.519"></path>
    <path d="M4 6h10M4 10h7M4 14h4"></path>
  </svg>
);

const FloodRiskCard = ({ prediction }) => {
  if (!prediction) return null;

  const {
    regionName = "N/A",
    predictionDate,
    floodRiskLevel = "N/A",
    confidenceScore,
    details,
    affectedAreas
  } = prediction;

  let riskColorClass = "text-gray-700 dark:text-gray-300";
  let riskBgClass = "bg-gray-100 dark:bg-gray-600";

  switch (floodRiskLevel?.toLowerCase()) {
    case 'high':
      riskColorClass = "text-red-700 dark:text-red-400 font-bold";
      riskBgClass = "bg-red-100 dark:bg-red-700/30";
      break;
    case 'moderate':
      riskColorClass = "text-yellow-600 dark:text-yellow-400 font-semibold";
      riskBgClass = "bg-yellow-100 dark:bg-yellow-700/30";
      break;
    case 'low':
      riskColorClass = "text-green-700 dark:text-green-400";
      riskBgClass = "bg-green-100 dark:bg-green-700/30";
      break;
    default:
      break;
  }

  return (
    <div className="bg-white dark:bg-env-gray-dark rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{regionName}</h3>
          <div className={`p-2 rounded-full ${riskBgClass} ml-2`}>
            <FloodIcon /> {/* Placeholder Icon */}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Flood Risk Level:</p>
          <p className={`text-2xl ${riskColorClass}`}>{floodRiskLevel}</p>
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
        {details && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Details:</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{details}</p>
          </div>
        )}
        {affectedAreas && affectedAreas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Potentially Affected Areas:</p>
            <ul className="list-disc list-inside pl-1">
              {affectedAreas.map((area, index) => (
                <li key={index} className="text-xs text-gray-500 dark:text-gray-400">{area}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloodRiskCard; 