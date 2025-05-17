import React from 'react';

function MapView({ userLocation, spots }) {
  return (
    <div className="h-full w-full">
      <iframe
        src="https://www.google.com/maps/d/embed?mid=1CyOiZJ_rBHIQpObI1ERtarjkceLueDg&ehbc=2E312F&noprof=1"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default MapView; 