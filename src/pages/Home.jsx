import React, { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import TouristSpotList from '../components/TouristSpotList';
import CouponList from '../components/CouponList';
import { useGeolocation, calculateDistance } from '../utils/geoUtils';

// Dados simulados de pontos turísticos e cupons
const TOURIST_SPOTS = [
  { 
    id: 'catedral', 
    name: 'Catedral Diocesana', 
    description: 'Principal igreja de Lages, cartão postal da cidade.',
    latitude: -27.816034,
    longitude: -50.326191
  },
  { 
    id: 'mirante', 
    name: 'Morro da Cruz', 
    description: 'Vista panorâmica da cidade de Lages.',
    latitude: -27.807849,
    longitude: -50.329409
  },
  { 
    id: 'parque-europa', 
    name: 'Parque Natural de Lages', 
    description: 'Parque com lagos e trilhas.',
    latitude: -27.819123,
    longitude: -50.327456
  },
  { 
    id: 'museu', 
    name: 'Museu Thiago de Castro', 
    description: 'Museu histórico de Lages.',
    latitude: -27.815678,
    longitude: -50.325789
  },
  {
    id: 'orion',
    name: 'Orion Parque',
    description: 'Parque tecnológico e de inovação de Lages.',
    latitude: -27.80177140008802,
    longitude: -50.33711196160061
  }
];

const COUPONS = [
  { id: 'cupom1', spotId: 'catedral', store: 'Café Catedral', description: '10% de desconto em qualquer café.' },
  { id: 'cupom2', spotId: 'mirante', store: 'Lages Souvenirs', description: 'R$ 5 de desconto em lembranças.' },
  { id: 'cupom3', spotId: 'parque-natural', store: 'Restaurante X', description: 'Cachaça grátis no almoço.' },
  { id: 'cupom4', spotId: 'museu', store: 'Livraria do Museu', description: '15% de desconto em livros.' },
  { id: 'cupom5', spotId: 'orion', store: 'Café do Orion', description: '20% de desconto em qualquer bebida.' }
];

function Home() {
  const [checkedInSpots, setCheckedInSpots] = useState(() => {
    return JSON.parse(localStorage.getItem('checkedInSpots') || '[]');
  });
  const [usedCoupons, setUsedCoupons] = useState(() => {
    return JSON.parse(localStorage.getItem('usedCoupons') || '[]');
  });
  const [nearbySpots, setNearbySpots] = useState([]);
  const { location, error } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 5000
  });

  useEffect(() => {
    localStorage.setItem('checkedInSpots', JSON.stringify(checkedInSpots));
  }, [checkedInSpots]);

  useEffect(() => {
    localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));
  }, [usedCoupons]);

  // Monitorar proximidade dos pontos turísticos
  useEffect(() => {
    if (location) {
      const nearby = TOURIST_SPOTS.filter(spot => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          spot.latitude,
          spot.longitude
        );
        return distance <= 50; // 50 metros
      });

      // Verificar se há novos pontos próximos
      const newNearbySpots = nearby.filter(spot => !nearbySpots.find(ns => ns.id === spot.id));
      
      if (newNearbySpots.length > 0) {
        setNearbySpots(nearby);
        newNearbySpots.forEach(spot => {
          const availableCoupons = COUPONS.filter(coupon => 
            coupon.spotId === spot.id && !usedCoupons.includes(coupon.id)
          );
          
          if (availableCoupons.length > 0) {
            // Mostrar alerta usando a API nativa de notificações
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Você está próximo a ${spot.name}!`, {
                body: 'Há cupons disponíveis para este local. Faça check-in para desbloqueá-los!',
                icon: '/locall-icon.png'
              });
            } else {
                
              // Fallback para alert quando notificações não estão disponíveis
              alert(`Você está próximo a ${spot.name}! Há cupons disponíveis para este local.`);
            }
          }
        });
      }
    }
  }, [location, nearbySpots, usedCoupons]);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleCheckIn = (spotId) => {
    if (!checkedInSpots.includes(spotId)) {
      setCheckedInSpots([...checkedInSpots, spotId]);
    }
  };

  const handleUseCoupon = (couponId) => {
    if (!usedCoupons.includes(couponId)) {
      setUsedCoupons([...usedCoupons, couponId]);
    }
  };

  // Cupons desbloqueados após check-in
  const unlockedCoupons = COUPONS.filter(coupon => checkedInSpots.includes(coupon.spotId));

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Erro ao acessar sua localização: {error}</p>
          <p className="text-sm">Para usar todos os recursos do app, por favor habilite a localização.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-8 max-w-4xl mx-auto">
      <MapView userLocation={location} spots={TOURIST_SPOTS} />
      <TouristSpotList 
        spots={TOURIST_SPOTS} 
        onCheckIn={handleCheckIn} 
        checkedInSpots={checkedInSpots}
        nearbySpots={nearbySpots.map(spot => spot.id)}
      />
      <CouponList coupons={unlockedCoupons} onUseCoupon={handleUseCoupon} usedCoupons={usedCoupons} />
    </div>
  );
}

export default Home; 