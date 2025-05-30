import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../components/Spinner';
import authService from '../services/authService';
const API_URL = import.meta.env.VITE_API_URL;

const PlaceholderChart = ({ title }) => (
  <div className="bg-white dark:bg-env-gray-dark p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
      <p className="text-gray-500 dark:text-gray-400">Chart Placeholder for: {title}</p>
    </div>
  </div>
);

const EnvDashboardPage = () => {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs can remain for future use, or be removed if not needed for non-animation purposes
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const summaryCardsSectionRef = useRef(null);
  const summaryCardsGridRef = useRef(null);
  const chartsSectionRef = useRef(null);
  const chartsGridRef = useRef(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true); setError(null);
      try {
        const data = await authService.authenticatedFetch(`${API_URL}/api/dashboard/dominica`);
        setPageData(data);
      } catch (e) {
        console.error("Failed to fetch dashboard page data:", e);
        setError("Failed to load live environmental dashboard. Please try again later.");
      } setIsLoading(false);
    };
    fetchPageData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-env-gray-darker p-4">
        <Spinner color="border-mygreen" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading Environmental Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-env-gray-darker p-4">
        <p className="text-2xl text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-env-gray-darker p-4">
        <p className="text-2xl text-gray-600 dark:text-gray-300">No data available for the dashboard at the moment.</p>
      </div>
    );
  }

  // Destructure data once available
  const { region, lastUpdated, summaryCards, charts } = pageData;

  return (
    <div ref={pageRef} className="bg-gray-100 dark:bg-env-gray-darker p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      { pageData && (
        <>
          <header ref={headerRef} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
              Live Environmental Dashboard: {region}
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Real-time insights for key environmental indicators. Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </header>

          {/* Data Cards Section */}
          {summaryCards && summaryCards.length > 0 ? (
            <section ref={summaryCardsSectionRef} className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                Live Data Overview
              </h2>
              <div ref={summaryCardsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-env-gray-dark p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.title}</h3>
                    <p className="mt-1 text-4xl font-semibold text-gray-900 dark:text-white">
                      {item.value}{' '}
                      {item.unit && <span className="text-xl font-medium text-gray-600 dark:text-gray-300">{item.unit}</span>}
                    </p>
                    {item.trend && (
                      <p className={`mt-2 text-sm font-medium ${
                        item.trend === 'improving' || item.trend === 'reducing' ? 'text-green-600 dark:text-green-400' :
                        item.trend === 'stable' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        Trend: {item.trend}
                      </p>
                    )}
                    {item.details && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-12">
               <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Live Data Overview</h2>
              <p className="text-gray-600 dark:text-gray-300">Summary data is currently unavailable.</p>
            </section>
          )}

          {/* Charts Section */}
          <section ref={chartsSectionRef} className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Trend Visualizations
            </h2>
            <div ref={chartsGridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts && charts.airQualityOverTime ? (
                <div className="bg-white dark:bg-env-gray-dark p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{charts.airQualityOverTime.title || "Air Quality Over Time"}</h3>
                  {charts.airQualityOverTime.data && charts.airQualityOverTime.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={charts.airQualityOverTime.data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem' }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} name="UV Index" />
                        {charts.airQualityOverTime.data[0]?.pv !== undefined && <Line type="monotone" dataKey="pv" stroke="#82ca9d" name="Pollutant Value" />}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : <p className="text-gray-500 dark:text-gray-400 h-64 flex items-center justify-center">No time-series data available for air quality.</p>}
                </div>
              ) : <PlaceholderChart title="Air Quality Over Time" /> }

              {charts && charts.waterQualityTrends ? (
                  <div className="bg-white dark:bg-env-gray-dark p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{charts.waterQualityTrends.title || "Water Quality Trends"}</h3>
                    {charts.waterQualityTrends.data && charts.waterQualityTrends.data.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={charts.waterQualityTrends.data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#E5E7EB' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="turbidity" stroke="#3B82F6" name="Turbidity" /> 
                             {charts.waterQualityTrends.data[0]?.ph !== undefined && <Line type="monotone" dataKey="ph" stroke="#10B981" name="pH Level" />}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : <p className="text-gray-500 dark:text-gray-400 h-64 flex items-center justify-center">No time-series data available for water quality.</p>}
                  </div>
              ) : <PlaceholderChart title="Water Quality Trends" />}
            </div>
          </section>
        </>
      )}
       {/* Add tall div here if needed for testing scroll height without GSAP interference */}
       {/* <div style={{ height: '2000px', border: '1px solid blue' }}>Tall test div</div> */}
    </div>
  );
};

export default EnvDashboardPage; 