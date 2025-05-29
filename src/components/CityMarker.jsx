import React, { useState } from 'react';
import { Html } from '@react-three/drei';
// import { FaMapMarkerAlt } from 'react-icons/fa'; // Commented out for debugging

const CityMarker = ({ position, name, population }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true); // DEBUG: Popup always visible

  const markerSize = 5; // DEBUG: Increased marker size for visibility
  const popupDistanceFactor = 1.5; 

  return (
    <group position={position}>
      {/* DEBUG: Using a visible sphere marker */}
      <mesh 
        onClick={() => setIsPopupVisible(!isPopupVisible)} 
        scale={[markerSize, markerSize, markerSize]}
      >
        <sphereGeometry args={[0.5, 16, 16]} /> 
        <meshStandardMaterial color="magenta" emissive="magenta" emissiveIntensity={2} /> {/* Bright magenta sphere */}
      </mesh>

      {/* 
      <Html
        center
        distanceFactor={10} 
        onClick={() => setIsPopupVisible(!isPopupVisible)}
        style={{ cursor: 'pointer', color: 'red' }}
      >
        <FaMapMarkerAlt size="2em" /> 
      </Html>
      */}

      {isPopupVisible && (
        <Html
          position={[0, markerSize * popupDistanceFactor, 0]} // Position popup above the marker
          center
          distanceFactor={15} // Keeps popup size relatively constant
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-xl text-sm text-slate-900 dark:text-white"
          transform
        >
          <div className="text-center">
            <h4 className="font-bold text-md mb-1">{name}</h4>
            {population && <p className="text-xs">Population: {population.toLocaleString()}</p>}
            {/* Add more city info here later if needed */}
            <button 
              onClick={() => setIsPopupVisible(false)} 
              className="mt-2 px-2 py-1 bg-mygreen text-white rounded hover:bg-mygreen-dark text-xs"
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

export default CityMarker; 