import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Spinner from './Spinner';

gsap.registerPlugin(ScrollTrigger);

// Placeholder icons - consider using a library like react-icons or custom SVGs
const MetricIcon = ({ IconComponent, colorClass }) => (
  <div className={`p-3 rounded-full ${colorClass || 'bg-mygreen/20 text-mygreen'} mr-4`}>
    <IconComponent className="w-6 h-6" />
  </div>
);

// Example Icon Components (simple SVGs for placeholders)
const AirIcon = (props) => (
  <svg {...props} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M5 12c0-1.933 1.567-3.5 3.5-3.5S12 10.067 12 12s-1.567 3.5-3.5 3.5S5 13.933 5 12zm0 0H3m2 0h2m11-5a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const WaterIcon = (props) => (
  <svg {...props} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-4a6 6 0 100-12 6 6 0 000 12z"></path>
    <path d="M12 12a3 3 0 100-6 3 3 0 000 6z"></path>
  </svg>
);
const TempIcon = (props) => (
  <svg {...props} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M8 13.5a4 4 0 100-8 4 4 0 000 8zm0 0V21M8 3.5V2M12 4.5h7M12 9.5h7M12 14.5h7"></path>
  </svg>
);

// Default/initial structure for metrics, including mapping icon components
const initialMetricDefinitions = {
  aqi: { 
    name: "Air Quality Index (AQI)", 
    icon: AirIcon, 
    defaultDetails: "Roseau Capital Average", 
    getStyle: (value) => {
      const aqiVal = parseInt(value);
      if (aqiVal <= 50) return { iconBg: "bg-green-100 dark:bg-green-700/30", iconText: "text-green-600 dark:text-green-300", valueText: "text-green-700 dark:text-green-300" };
      if (aqiVal <= 100) return { iconBg: "bg-yellow-100 dark:bg-yellow-700/30", iconText: "text-yellow-600 dark:text-yellow-400", valueText: "text-yellow-700 dark:text-yellow-400" };
      if (aqiVal <= 150) return { iconBg: "bg-orange-100 dark:bg-orange-700/30", iconText: "text-orange-600 dark:text-orange-400", valueText: "text-orange-700 dark:text-orange-400" };
      return { iconBg: "bg-red-100 dark:bg-red-700/30", iconText: "text-red-600 dark:text-red-400", valueText: "text-red-700 dark:text-red-400" };
    }
  },
  waterQuality: { 
    name: "River Water Quality", 
    icon: WaterIcon, 
    defaultDetails: "Layou River Monitoring Point",
    getStyle: (value) => { // Assuming value is a percentage for purity
        const purity = parseInt(value);
        if (purity >= 90) return { iconBg: "bg-blue-100 dark:bg-blue-700/30", iconText: "text-blue-600 dark:text-blue-300", valueText: "text-blue-700 dark:text-blue-300" };
        if (purity >= 70) return { iconBg: "bg-sky-100 dark:bg-sky-700/30", iconText: "text-sky-600 dark:text-sky-400", valueText: "text-sky-700 dark:text-sky-400" };
        return { iconBg: "bg-orange-100 dark:bg-orange-700/30", iconText: "text-orange-600 dark:text-orange-400", valueText: "text-orange-700 dark:text-orange-400" };
    }
  },
  temperature: { 
    name: "Ambient Temperature", 
    icon: TempIcon, 
    defaultDetails: "Canefield Airport Vicinity",
    getStyle: (value) => { // Example: color by temperature range
        const temp = parseFloat(value);
        if (temp >= 28) return { iconBg: "bg-red-100 dark:bg-red-700/30", iconText: "text-red-500 dark:text-red-400", valueText: "text-red-600 dark:text-red-400" };
        if (temp <= 22) return { iconBg: "bg-blue-100 dark:bg-blue-700/30", iconText: "text-blue-500 dark:text-blue-300", valueText: "text-blue-600 dark:text-blue-300" };
        return { iconBg: "bg-yellow-100 dark:bg-yellow-700/30", iconText: "text-yellow-600 dark:text-yellow-400", valueText: "text-yellow-700 dark:text-yellow-400" };
    }
  },
};

const LiveDataDashboardSection = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null); // Ref for the div wrapping the cards

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;

    gsap.fromTo(titleEl, 
      { autoAlpha: 0, y: 30 }, 
      {
        autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      }
    );
  }, []);

  useEffect(() => {
    // Animate cards when metricsData is loaded and valid
    if (metricsData && cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children;
      gsap.fromTo(cards, 
        { autoAlpha: 0, y: 50, scale: 0.95 }, 
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: "power3.out",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top 85%", // Trigger when the container is visible
            toggleActions: "play none none none",
          }
        }
      );
    }
  }, [metricsData]); // Rerun this effect when metricsData changes

  const fetchDashboardData = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/live-data`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMetricsData(data);
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
      setError("Failed to load live environmental data. Please try again later.");
    }
    if (isLoading) setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []); // isLoading is not in dependency array to avoid re-triggering initial card load animation on polls

  let content;

  if (isLoading && !metricsData) {
    content = <Spinner />
  } else if (error && !metricsData) {
    content = <p className="text-center text-red-300 py-10">{error}</p>;
  } else if (metricsData) {
    const displayableMetrics = Object.keys(initialMetricDefinitions).map(key => {
      const definition = initialMetricDefinitions[key];
      const liveData = metricsData[key];
      if (!liveData || liveData.value === undefined || liveData.unit === undefined) return null;

      const style = definition.getStyle ? definition.getStyle(liveData.value) : { iconBg: 'bg-gray-100', iconText: 'text-gray-600', valueText: 'text-gray-700' };
      
      return {
        id: key,
        name: definition.name,
        value: liveData.value,
        unit: liveData.unit,
        iconBg: style.iconBg,
        iconText: style.iconText,
        valueText: style.valueText,
        icon: definition.icon,
        details: liveData.details || definition.defaultDetails,
      };
    }).filter(Boolean);

    content = (
      <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayableMetrics.length > 0 ? displayableMetrics.map((metric) => (
          <div 
            key={metric.id} 
            className={`bg-white dark:bg-env-gray-dark rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-2xl`}
          >
            <div className="flex items-center mb-4">
              <MetricIcon IconComponent={metric.icon} colorClass={`${metric.iconBg} ${metric.iconText}`} />
              <div>
                <h3 className={`text-base font-semibold text-gray-700 dark:text-gray-200`}>
                  {metric.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.details}</p>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className={`text-4xl font-bold ${metric.valueText}`}>{metric.value}</p>
              <p className={`text-sm ${metric.valueText} opacity-80`}>{metric.unit}</p>
            </div>
          </div>
        )) : <p className="text-center text-white col-span-full py-10">No live data available at the moment.</p>}
      </div>
    );
  } else {
    content = <p className="text-center text-white py-10">No live data available at the moment, or failed to load.</p>;
  }
  
  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-mygreen dark:bg-mygreen-dark overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-12 md:mb-16 opacity-0 transform translate-y-[30px]">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Dominica: Current Environmental Snapshot
          </h2>
          <p className="mt-4 text-lg text-white opacity-90 max-w-2xl mx-auto">
            Real-time insights into key environmental indicators across the Nature Isle.
          </p>
        </div>
        {content}
        <div className="text-center mt-12">
            <p className="text-sm text-white opacity-80">
                {isLoading && metricsData ? "Updating live data..." : (error ? "Problem updating data." : "Data is fetched from live sensors and APIs for Dominica.")}
            </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDataDashboardSection; 