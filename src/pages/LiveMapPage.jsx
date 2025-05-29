import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import JSZip from 'jszip';
import { kml } from '@tmcw/togeojson';

const kmzFiles = [
  { name: 'Coast', path: '/Coast.kmz' },
  { name: 'Soils', path: '/Soils.kmz' },
  { name: 'Rivers', path: '/Rivers.kmz' },
  { name: 'Roads', path: '/Roads.kmz' },
];

const LiveMapPage = () => {
  const [geojsonData, setGeojsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKMZData = async () => {
      setLoading(true);
      setError(null);
      const allGeojson = [];

      for (const fileInfo of kmzFiles) {
        try {
          const response = await fetch(fileInfo.path);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${fileInfo.name}: ${response.statusText}`);
          }
          const blob = await response.blob();
          const zip = await JSZip.loadAsync(blob);
          
          // Find the .kml file within the .kmz
          const kmlFile = Object.keys(zip.files).find(filename => filename.toLowerCase().endsWith('.kml'));
          
          if (!kmlFile) {
            console.warn(`No .kml file found in ${fileInfo.name}`);
            continue;
          }

          const kmlContent = await zip.files[kmlFile].async('text');
          const dom = new DOMParser().parseFromString(kmlContent, 'text/xml');
          const geojson = kml(dom);
          
          // Add a property to distinguish layers if needed, e.g., for styling or toggling
          if (geojson.features) {
            geojson.features.forEach(feature => {
              feature.properties = { ...feature.properties, layerName: fileInfo.name };
            });
          }
          
          allGeojson.push({ name: fileInfo.name, data: geojson });

        } catch (err) {
          console.error(`Error processing ${fileInfo.name}:`, err);
          // Optionally, accumulate errors to display them
          setError(prevError => prevError ? `${prevError}; ${err.message}` : err.message);
        }
      }
      setGeojsonData(allGeojson);
      setLoading(false);
    };

    loadKMZData();
  }, []);

  if (loading) return <p className="text-center p-8">Loading map data...</p>;
  if (error) return <p className="text-center p-8 text-red-500">Error loading map data: {error}</p>;
  if (!geojsonData.length) return <p className="text-center p-8">No map data to display.</p>;

  // Default map center and zoom - adjust as needed
  const mapCenter = [15.4150, -61.3710]; // Approximate center for Dominica
  const mapZoom = 9;

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-100px)]"> {/* Adjust height as needed */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Live Environmental Data Map</h1>
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} className="rounded-lg shadow-xl">
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          {geojsonData.map((layer, index) => (
            layer.data && (
              <LayersControl.Overlay key={`${layer.name}-${index}`} name={layer.name} checked>
                <GeoJSON data={layer.data} />
              </LayersControl.Overlay>
            )
          ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default LiveMapPage; 