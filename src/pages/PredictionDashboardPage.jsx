import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../components/Spinner';
import EcoSitePressureCard from '../components/EcoSitePressureCard';
import FloodRiskCard from '../components/FloodRiskCard';
const API_URL = import.meta.env.VITE_API_URL;

const PredictionDashboardPage = () => {
  const [ecoTourismPredictions, setEcoTourismPredictions] = useState([]);
  const [floodRiskPredictions, setFloodRiskPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const ecoTourismSectionRef = useRef(null);
  const ecoTourismGridRef = useRef(null);
  const floodRiskSectionRef = useRef(null);
  const floodRiskGridRef = useRef(null);

  useEffect(() => {
    const fetchAllPredictions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [ecoTourismResponse, floodRiskResponse] = await Promise.all([
          fetch(`${API_URL}/api/predict/eco-tourism/pressure/all`),
          fetch(`${API_URL}/api/predict/flood-risk/all`)
        ]);

        if (!ecoTourismResponse.ok) {
          throw new Error(`Eco-tourism API error! status: ${ecoTourismResponse.status}`);
        }
        if (!floodRiskResponse.ok) {
          throw new Error(`Flood risk API error! status: ${floodRiskResponse.status}`);
        }

        const ecoTourismData = await ecoTourismResponse.json();
        const floodRiskData = await floodRiskResponse.json();

        setEcoTourismPredictions(ecoTourismData || []);
        setFloodRiskPredictions(floodRiskData || []);

      } catch (e) {
        console.error("Failed to fetch prediction data:", e);
        setError(e.message || "Failed to load prediction data. Please try again later.");
      }
      setIsLoading(false);
    };

    fetchAllPredictions();
    // Optional: set up an interval to refresh data
    // const intervalId = setInterval(fetchAllPredictions, 300000); // every 5 minutes
    // return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-env-gray-darker p-4"><Spinner color="border-mygreen" /> <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading predictions...</p></div>;
  if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-env-gray-darker p-4"><p className="text-2xl text-red-600 dark:text-red-400">Error: {error}</p></div>;
  
  return (
    <div ref={pageRef} className="bg-gray-100 dark:bg-env-gray-darker p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <header ref={headerRef} className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
          Dominica: Predictive Environmental Insights
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Forecasts and risk assessments for key environmental factors.
        </p>
      </header>
      
      {(!isLoading && !error && ecoTourismPredictions.length === 0 && floodRiskPredictions.length === 0) && (
          <div className="text-center py-10">
              <p className="text-xl text-gray-500 dark:text-gray-400">No prediction data available at the moment.</p>
          </div>
      )}

      {(!isLoading && !error && (ecoTourismPredictions.length > 0 || floodRiskPredictions.length > 0)) && (
        <div className="space-y-12">
          {ecoTourismPredictions.length > 0 && (
            <section ref={ecoTourismSectionRef} id="eco-tourism-predictions">
              <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                Eco-Tourism Hotspot Pressure
              </h2>
              <div ref={ecoTourismGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ecoTourismPredictions.map((prediction) => (
                  <div key={prediction.siteId || prediction.siteName}>
                    <EcoSitePressureCard prediction={prediction} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {floodRiskPredictions.length > 0 && (
            <section ref={floodRiskSectionRef} id="flood-risk-predictions">
              <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                Flood Risk Forecasts
              </h2>
              <div ref={floodRiskGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {floodRiskPredictions.map((prediction) => (
                  <div key={prediction.regionName}>
                    <FloodRiskCard prediction={prediction} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionDashboardPage; 