import React, { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import TouristSpotList from '../components/TouristSpotList';
import CouponList from '../components/CouponList';

// Dados simulados de pontos turísticos e cupons
const TOURIST_SPOTS = [
  { id: 'catedral', name: 'Catedral Diocesana', description: 'Principal igreja de Lages, cartão postal da cidade.' },
  { id: 'mirante', name: 'Morro da Cruz', description: 'Vista panorâmica da cidade de Lages.' },
  { id: 'parque-europa', name: 'Parque Natural de Lages', description: 'Parque com lagos e trilhas.' },
  { id: 'museu', name: 'Museu Thiago de Castro', description: 'Museu histórico de Lages.' },
];

const COUPONS = [
  { id: 'cupom1', spotId: 'catedral', store: 'Café Catedral', description: '10% de desconto em qualquer café.' },
  { id: 'cupom2', spotId: 'mirante', store: 'Lages Souvenirs', description: 'R$ 5 de desconto em lembranças.' },
  { id: 'cupom3', spotId: 'parque-natural', store: 'Restaurante X', description: 'Cachaça grátis no almoço.' },
  { id: 'cupom4', spotId: 'museu', store: 'Livraria do Museu', description: '15% de desconto em livros.' },
];

function Home() {
  const [checkedInSpots, setCheckedInSpots] = useState(() => {
    return JSON.parse(localStorage.getItem('checkedInSpots') || '[]');
  });
  const [usedCoupons, setUsedCoupons] = useState(() => {
    return JSON.parse(localStorage.getItem('usedCoupons') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('checkedInSpots', JSON.stringify(checkedInSpots));
  }, [checkedInSpots]);

  useEffect(() => {
    localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));
  }, [usedCoupons]);

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

  return (
    <div className="p-4 flex flex-col gap-8 max-w-4xl mx-auto">
      <MapView />
      <TouristSpotList spots={TOURIST_SPOTS} onCheckIn={handleCheckIn} checkedInSpots={checkedInSpots} />
      <CouponList coupons={unlockedCoupons} onUseCoupon={handleUseCoupon} usedCoupons={usedCoupons} />
    </div>
  );
}

export default Home; 