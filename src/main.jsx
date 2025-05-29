import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import * as Cesium from 'cesium'; // Removed
// import 'cesium/Build/Cesium/Widgets/widgets.css'; // Already removed

// --- REMOVED CESIUM BASE URL --- 
// window.CESIUM_BASE_URL = '/Cesium/';
// --- END REMOVED CESIUM BASE URL ---

// --- REMOVED CESIUM ION ACCESS TOKEN --- 
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOThjODQ4ZC1jZDdhLTQyM2MtYWVmZi0yOTY3OGNmMDA0NTQiLCJpZCI6MzA3MzExLCJpYXQiOjE3NDg0ODcwNDJ9.1iQdp5HfxTbEMVfaSgBVMX8NJPKchsBhYerMJubxq-s';
// --- END REMOVED CESIUM ION ACCESS TOKEN ---

// Helper function to remove the initial loader
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.remove();
  }
};

const RootApp = () => {
  useEffect(() => {
    removeInitialLoader();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<RootApp />);
