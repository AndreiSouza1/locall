import { useState, useEffect } from 'react';

// Função para calcular a distância entre dois pontos usando a fórmula de Haversine
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metros
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // em metros
};

// Hook personalizado para gerenciar a geolocalização
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let watchId;

    const isDebug = import.meta.env.VITE_DEBUG == true;
    
    if (isDebug) {
      // Usar localização fixa de debug
      setLocation({
        latitude: -27.80177140008802,
        longitude: -50.33711196160061,
        accuracy: 10 // precisão fixa de 10 metros
      });
      return;
    }

    // Função para lidar com sucesso na obtenção da localização
    const onSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed
      });
      setError(null);
    };

    // Função para lidar com erros
    const onError = (error) => {
      setError(error);
    };

    // Tentar obter a localização
    if (!navigator.geolocation) {
      setError(new Error('Geolocalização não é suportada pelo seu navegador'));
    } else {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

    // Cleanup
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options]);

  return { location, error };
}; 