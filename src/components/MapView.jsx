import React from 'react';

function MapView({ userLocation, spots }) {
  return (
    <div className="w-full flex justify-center">
      <iframe
        src="https://www.google.com/maps/d/embed?mid=1CyOiZJ_rBHIQpObI1ERtarjkceLueDg&ehbc=2E312F&noprof=1"
        width="100%"
        height="480"
        style={{ border: 0, borderRadius: '1rem' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default MapView; 