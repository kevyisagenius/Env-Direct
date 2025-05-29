import React from 'react';
import Plot from 'react-plotly.js';

const RegionInfoPanel = ({ regionData, onClose }) => {
  if (!regionData) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-slate-800 bg-opacity-80 backdrop-blur-md rounded-lg text-white shadow-xl max-w-md w-full text-center">
        <p className="text-lg">Click on a region on the 3D map to explore its climate data.</p>
        <p className="text-sm mt-2">(Ensure your 3D model has selectable regions with names like "Roseau", "Portsmouth", etc.)</p>
      </div>
    );
  }

  const { name, temperature, rainfall, deforestation, riskScore } = regionData;
  const years = [1990, 2000, 2010, 2020]; // Assuming common years for sample data

  // Define a consistent dark theme for Plotly charts
  const plotlyDarkLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)', // Transparent background
    plot_bgcolor: 'rgba(30,30,30,0.7)',  // Slightly transparent dark plot area
    font: { color: '#E0E0E0' },       // Light text color
    xaxis: { 
      gridcolor: '#444444', 
      linecolor: '#555555',
      zerolinecolor: '#555555'
    },
    yaxis: { 
      gridcolor: '#444444', 
      linecolor: '#555555',
      zerolinecolor: '#555555'
    },
    legend: {
      font: { color: '#E0E0E0' }
    },
    margin: { t: 40, b: 40, l: 50, r: 20 }, // Adjust margins
  };

  const temperatureData = [{
    x: years,
    y: temperature,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Avg Temp (°C)',
    marker: { color: '#FF8F00' }, // Warm orange
    line: { color: '#FF8F00' },
  }];

  const rainfallData = [{
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Sample months
    y: rainfall, // Assuming rainfall is an array of 12 monthly values
    type: 'bar',
    name: 'Rainfall (mm)',
    marker: { color: '#29B6F6' }, // Light blue
  }];
  
  const deforestationData = [{
    x: years,
    y: deforestation,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Deforestation (%)',
    marker: { color: '#8D6E63' }, // Earthy brown
    line: { color: '#8D6E63' },
    yaxis: 'y2'
  }];


  return (
    <div className="absolute top-0 right-0 m-4 p-6 bg-slate-900 bg-opacity-80 backdrop-blur-md rounded-lg text-white shadow-xl max-w-sm w-full h-[calc(100vh-6rem)] overflow-y-auto z-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-mygreen">{name}</h2>
        <button 
          onClick={onClose} 
          className="text-white hover:text-mygreen-light text-2xl"
          aria-label="Close panel"
        >
          &times;
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-slate-800 rounded">
        <p className="text-sm text-gray-400">Climate Risk Score</p>
        <p className="text-3xl font-semibold text-mygreen-light">{riskScore}/100</p>
      </div>

      <div className="mb-3">
        <h4 className="text-lg font-semibold mb-1 text-gray-300">Temperature Trend</h4>
        <Plot 
          data={temperatureData} 
          layout={{ ...plotlyDarkLayout, title: 'Avg. Temperature Over Years' }} 
          style={{ width: '100%', height: '200px' }}
          config={{ displayModeBar: false }}
        />
      </div>
      
      <div className="mb-3">
        <h4 className="text-lg font-semibold mb-1 text-gray-300">Monthly Rainfall</h4>
        <Plot 
          data={rainfallData} 
          layout={{ ...plotlyDarkLayout, title: 'Avg. Monthly Rainfall' }}
          style={{ width: '100%', height: '200px' }}
          config={{ displayModeBar: false }}
        />
      </div>

      <div className="mb-3">
        <h4 className="text-lg font-semibold mb-1 text-gray-300">Deforestation Trend</h4>
         <Plot
          data={deforestationData}
          layout={{
            ...plotlyDarkLayout,
            title: 'Deforestation Over Years',
            yaxis: { title: 'Area (%)', titlefont: {color: '#8D6E63'}, tickfont: {color: '#8D6E63'}, side: 'left', overlaying: 'y', showgrid: false },
          }}
          style={{ width: '100%', height: '200px' }}
          config={{ displayModeBar: false }}
        />
      </div>
      {/* Add more plots or data displays here */}
    </div>
  );
};

export default RegionInfoPanel; 