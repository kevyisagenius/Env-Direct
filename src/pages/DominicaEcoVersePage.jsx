import React, { useState, useEffect, Suspense } from 'react';
import ThreeMap from '../components/ThreeMap';
import RegionInfoPanel from '../components/RegionInfoPanel';
import Spinner from '../components/Spinner'; // Assuming Spinner is in components folder

// Mock API data (replace with actual API calls later)
const mockRegionApiData = {
  "Roseau": {
    name: "Roseau",
    temperature: [25.1, 25.3, 25.7, 26.1, 26.5, 26.8, 27.0, 27.1, 26.9, 26.5, 26.0, 25.5],
    rainfall: [120, 180, 200, 150, 170, 210, 250, 260, 230, 190, 160, 130],
    deforestation: [10, 10.5, 11, 11.2, 11.5, 12, 12.3, 12.8, 13.1, 13.5, 14, 15],
    riskScore: 82
  },
  "Portsmouth": {
    name: "Portsmouth",
    temperature: [24.8, 25.0, 25.4, 25.8, 26.2, 26.5, 26.7, 26.8, 26.6, 26.2, 25.7, 25.2],
    rainfall: [100, 150, 170, 130, 150, 190, 220, 230, 200, 170, 140, 110],
    deforestation: [5, 5.2, 5.5, 5.6, 5.8, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5],
    riskScore: 65
  },
  // Add more mock data for other regions your GLB model might have names for
  "DefaultRegion": { // Fallback if a clicked region has no specific data
    name: "Dominica Region",
    temperature: [24, 24, 24, 24, 25, 25, 25, 25, 25, 24, 24, 24],
    rainfall: [150,150,150,150,150,150,150,150,150,150,150,150],
    deforestation: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    riskScore: 50
  }
};

const DominicaClimateExplorerPage = () => {
  const [selectedRegionName, setSelectedRegionName] = useState(null);
  const [selectedRegionData, setSelectedRegionData] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleRegionSelect = async (regionName) => {
    if (!regionName) {
      setSelectedRegionName(null);
      setSelectedRegionData(null);
      setIsPanelOpen(false);
      return;
    }

    setSelectedRegionName(regionName);
    setIsLoadingData(true);
    setIsPanelOpen(true);

    // Simulate API call
    console.log(`Fetching data for ${regionName}...`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const data = mockRegionApiData[regionName] || mockRegionApiData.DefaultRegion;
    // If specific region data doesn't exist, update its name to the selected one for display
    if (!mockRegionApiData[regionName]) {
        data.name = regionName;
    }

    setSelectedRegionData(data);
    setIsLoadingData(false);
    console.log("Data loaded: ", data);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    // Optionally, you might want to call handleRegionSelect(null) to deselect region on map too
    // handleRegionSelect(null); 
  };

  return (
    <div className="w-full h-screen relative flex flex-col bg-gray-800">
      {/* Header (Optional) */}
      <header className="bg-gray-900 text-white p-4 shadow-md z-30">
        <h1 className="text-2xl font-bold text-mygreen">Dominica Climate Explorer</h1>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow relative">
        <div className="absolute inset-0 z-10">
          <Suspense fallback={<div className="w-full h-full flex justify-center items-center"><Spinner /></div>}>
            <ThreeMap onRegionSelect={handleRegionSelect} />
          </Suspense>
        </div>

        {isPanelOpen && (
          isLoadingData ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <Spinner size="lg" /> 
            </div>
          ) : (
            <RegionInfoPanel regionData={selectedRegionData} onClose={closePanel} />
          )
        )}
      </div>
    </div>
  );
};

export default DominicaClimateExplorerPage; 