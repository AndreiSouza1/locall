import React, { useEffect, useState, useMemo } from 'react';
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
    longitude: -50.326191,
    website: null
  },
  { 
    id: 'mirante', 
    name: 'Morro da Cruz', 
    description: 'Vista panorâmica da cidade de Lages.',
    latitude: -27.807849,
    longitude: -50.329409,
    website: null
  },
  { 
    id: 'parque-europa', 
    name: 'Parque Natural de Lages', 
    description: 'Parque com lagos e trilhas.',
    latitude: -27.819123,
    longitude: -50.327456,
    website: null
  },
  { 
    id: 'museu', 
    name: 'Museu Thiago de Castro', 
    description: 'Museu histórico de Lages.',
    latitude: -27.815678,
    longitude: -50.325789,
    website: null
  },
  {
    id: 'orion',
    name: 'Orion Parque',
    description: 'Parque tecnológico e de inovação de Lages.',
    latitude: -27.80177140008802,
    longitude: -50.33711196160061,
    website: 'https://orionparque.com'
  },
  {
    id: 'cevey',
    name: 'Cevey Adegas e Artesanatos',
    description: 'Loja especializada em vinhos e artesanatos locais.',
    latitude: -27.825765414255557,
    longitude: -50.34384829828887,
    website: 'https://www.ceveyadegas.com.br'
  }
];

const COUPONS = [
  { id: 'cupom1', spotId: 'catedral', store: 'Café Catedral', description: '10% de desconto em qualquer café.' },
  { id: 'cupom2', spotId: 'mirante', store: 'Lages Souvenirs', description: 'R$ 5 de desconto em lembranças.' },
  { id: 'cupom3', spotId: 'parque-natural', store: 'Restaurante X', description: 'Cachaça grátis no almoço.' },
  { id: 'cupom4', spotId: 'museu', store: 'Livraria do Museu', description: '15% de desconto em livros.' },
  { id: 'cupom5', spotId: 'orion', store: 'Café do Orion', description: '20% de desconto em qualquer bebida.' },
  { id: 'LOCALL10', spotId: 'orion', store: 'Cevey Adegas e Artesanatos', description: '10% de desconto na primeira compra até 19/04.' }
];

function Home() {
  const [checkedInSpots, setCheckedInSpots] = useState(() => {
    return JSON.parse(localStorage.getItem('checkedInSpots') || '[]');
  });
  const [usedCoupons, setUsedCoupons] = useState(() => {
    return JSON.parse(localStorage.getItem('usedCoupons') || '[]');
  });
  const [nearbySpots, setNearbySpots] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [isHighAccuracy, setIsHighAccuracy] = useState(false);
  const [availableRewards, setAvailableRewards] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const { location, error } = useGeolocation({
    enableHighAccuracy: isHighAccuracy,
    maximumAge: 60000,
    timeout: isHighAccuracy ? 30000 : 20000
  });

  // Atualiza os cupons disponíveis quando a localização muda
  useEffect(() => {
    if (!location) return;

    const nearby = TOURIST_SPOTS.filter(spot => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );
      return distance <= 50; // 50 metros
    });

    // Encontra todos os cupons disponíveis para spots próximos
    const newAvailableCoupons = COUPONS.filter(coupon => 
      nearby.some(spot => spot.id === coupon.spotId) && 
      !usedCoupons.includes(coupon.id)
    );

    setAvailableCoupons(newAvailableCoupons);
    
    // Se há cupons disponíveis, define o spot com recompensas
    if (newAvailableCoupons.length > 0) {
      const spotWithRewards = nearby.find(spot => 
        newAvailableCoupons.some(coupon => coupon.spotId === spot.id)
      );
      setAvailableRewards(spotWithRewards);
    } else {
      setAvailableRewards(null);
    }

  }, [location, usedCoupons]);

  // Se falhar com precisão normal, tenta com alta precisão
  useEffect(() => {
    if (error && !isHighAccuracy) {
      console.log('Localização normal falhou, tentando com GPS...', error);
      setIsHighAccuracy(true);
    }
  }, [error, isHighAccuracy]);

  // Log de erros para debug
  useEffect(() => {
    if (error) {
      console.log('Erro de localização:', {
        code: error.code,
        message: error.message,
        highAccuracy: isHighAccuracy
      });
    }
  }, [error, isHighAccuracy]);

  // Função para pegar os spots próximos com distância
  const getNearbyWithDistance = () => {
    if (!location) return [];
    
    return TOURIST_SPOTS.map(spot => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );
      return { ...spot, distance };
    }).sort((a, b) => a.distance - b.distance)
      .slice(0, 3); // Pega os 3 mais próximos
  };

  // Verifica se há cupons disponíveis para spots com check-in
  const hasAvailableRewards = () => {
    if (!location) return false;
    
    const availableCoupons = COUPONS.filter(coupon => {
      // Encontra o spot relacionado ao cupom
      const spot = TOURIST_SPOTS.find(s => s.id === coupon.spotId);
      if (!spot) return false;
      
      // Calcula a distância do usuário até o spot
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );
      
      // Cupom está disponível se:
      // 1. O usuário fez check-in no local
      // 2. O cupom não foi usado ainda
      // 3. O usuário está a menos de 50 metros do local
      return checkedInSpots.includes(coupon.spotId) && 
             !usedCoupons.includes(coupon.id) &&
             distance <= 50;
    });
    
    return availableCoupons.length > 0;
  };

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
        
        // Encontra o spot mais próximo com cupons disponíveis
        const spotWithRewards = nearby.find(spot => {
          const availableCoupons = COUPONS.filter(coupon => 
            coupon.spotId === spot.id && !usedCoupons.includes(coupon.id)
          );
          console.log(availableCoupons);
          
          return availableCoupons.length > 0;
        });

        if (spotWithRewards) {
          setAvailableRewards(spotWithRewards);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Você está próximo a ${spotWithRewards.name}!`, {
              body: 'Há cupons disponíveis para este local. Clique em receber recompensas para desbloqueá-los!',
              icon: '/locall-icon.png'
            });
          } else {
            alert(`Você está próximo a ${spotWithRewards.name}! Há cupons disponíveis para este local.`);
          }
        } else {
          setAvailableRewards(null);
        }
      }
    }
  }, [location, nearbySpots, usedCoupons]);

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

  const handleCopyCoupon = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setIsCopied(true);
      
      // Remove o cupom da lista e marca como usado após copiar
      setTimeout(() => {
        handleUseCoupon(selectedCoupon.id);
      }, 1500);
    } catch (err) {
      console.error('Falha ao copiar cupom:', err);
    }
  };

  const openMaps = (coupon) => {
    // Encontra o spot correto baseado no nome da loja
    const spot = TOURIST_SPOTS.find(s => s.name === coupon.store) || 
                TOURIST_SPOTS.find(s => s.id === coupon.spotId);
    
    if (spot) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`, '_blank');
    }
  };

  if (error) {
    return (
      <>
        <div className="h-screen w-screen flex">
          {/* Mapa em tela cheia */}
          <div className="flex-1 h-full">
            <MapView userLocation={null} spots={TOURIST_SPOTS} />
          </div>

          {/* Menu Lateral */}
          <div className="w-1/4 bg-white shadow-lg z-10 flex flex-col">
            {/* Logo */}
            <div className="p-[15px] flex justify-center items-center">
              <img 
                src="/Logo - Locall.png"
                alt="Locall" 
                className="h-[100px] w-[100px] object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h2 className="text-2xl font-bold hidden">Locall</h2>
            </div>

            {/* Mensagem de Erro */}
            <div className="p-6">
              <div className="rounded-lg border border-red-200 p-4 bg-red-50">
                <h3 className="font-medium mb-2">
                  Não foi possível acessar sua localização
                </h3>
                <p className="text-sm mb-4">
                  Para usar todos os recursos do app, precisamos da sua localização. Por favor:
                </p>
                <ol className="text-sm space-y-2">
                  <li>1. Verifique se a localização está ativada no seu dispositivo</li>
                  <li>2. Permita o acesso à localização quando solicitado pelo navegador</li>
                  <li>3. Recarregue a página após permitir o acesso</li>
                </ol>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 w-full px-4 py-2 rounded font-medium bg-blue-600 text-white"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const nearbyWithDistance = getNearbyWithDistance();

  const nearestSpot = location ? TOURIST_SPOTS
    .map(spot => ({
      ...spot,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance)[0]
    : null;

  return (
    <div className="h-screen w-screen flex">
      {/* Mapa em tela cheia */}
      <div className="flex-1 h-full">
        <MapView userLocation={location} spots={TOURIST_SPOTS} />
      </div>

      {/* Menu Lateral */}
      <div className="w-1/4 bg-white shadow-lg z-10 flex flex-col h-screen px-[45px]">
        {/* Logo */}
        <div className="p-[15px] flex justify-center items-center">
          <img 
            src="/Logo - Locall.png"
            alt="Locall" 
            className="h-[100px] w-[100px] object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <h2 className="text-2xl font-bold hidden">Locall</h2>
        </div>

        {/* Container para as duas seções ou lista de cupons */}
        {!showCoupons ? (
          <div className="flex-1 flex flex-col">
            {/* Lugares próximos */}
            <div className="flex-1 flex flex-col items-center justify-center p-[15px]">
              <div className="flex flex-col items-center w-full">
                <p className="text-lg mb-4 text-center">
                  {location ? (
                    `${TOURIST_SPOTS.filter(spot => {
                      const distance = calculateDistance(
                        location.latitude,
                        location.longitude,
                        spot.latitude,
                        spot.longitude
                      );
                      return distance <= 300;
                    }).length} lugares próximos de você`
                  ) : (
                    'Buscando sua localização...'
                  )}
                </p>
                <button 
                  className="w-full px-4 py-2 rounded-lg font-medium"
                  onClick={() => {/* Adicionar funcionalidade */}}
                >
                  Visualizar
                </button>
              </div>
              <a href="/estabelecimentos" className="accent-link mt-4 font-light">
                Ver tudo
              </a>
            </div>

            {/* Divisor */}
            <div className="divider"></div>

            {/* Recompensas */}
            <div className="flex-1 flex flex-col items-center justify-center pb-[130px]">
              <div className="rewards-card">
                <p className="text-lg mb-4 text-center px-4">
                  {location ? (
                    availableRewards
                      ? 'Você tem prêmios disponíveis!'
                      : nearestSpot
                        ? `Próxima recompensa a ${nearestSpot.distance < 1000 
                            ? `${Math.round(nearestSpot.distance)}m` 
                            : `${(nearestSpot.distance / 1000).toFixed(1)}km`}`
                        : 'Buscando pontos próximos...'
                  ) : 'Buscando sua localização...'
                }
                </p>
                {location && (
                  <button 
                    className="w-full px-4 py-2 rounded-lg font-medium"
                    onClick={() => {
                      if (availableRewards) {
                        setShowCoupons(true);
                      } else if (nearestSpot) {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${nearestSpot.latitude},${nearestSpot.longitude}`, '_blank');
                      }
                    }}
                  >
                    {availableRewards ? 'Receber Recompensas' : 'Me mostre onde é'}
                  </button>
                )}
              </div>
            </div>

            {/* Divulgue conosco */}
            <div className="text-center pb-4">
              <a 
                href="https://wa.me/5549933008561"
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link font-light"
              >
                Divulgue conosco!
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto py-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Recompensas Disponíveis</h3>
              <button 
                onClick={() => setShowCoupons(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Voltar
              </button>
            </div>
            <div className="space-y-4">
              {availableCoupons.length > 0 ? (
                availableCoupons.map(coupon => {
                  const spot = TOURIST_SPOTS.find(s => s.id === coupon.spotId);
                  return (
                    <div 
                      key={coupon.id} 
                      className="p-4 rounded-lg border border-gray-200 hover:border-primary"
                    >
                      <h4 className="font-medium">{coupon.store}</h4>
                      <p className="text-sm text-gray-600 mb-2">{spot?.name}</p>
                      <p className="text-sm">{coupon.description}</p>
                      <button
                        onClick={() => setSelectedCoupon({ ...coupon, spot })}
                        className="mt-2 w-full px-3 py-1.5 rounded bg-primary text-white text-sm"
                      >
                        Resgatar
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-center">
                  Nenhuma recompensa disponível no momento.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Resgate */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
            {/* X no canto superior direito */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 absolute top-4 right-4 text-primary cursor-pointer" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              onClick={() => setSelectedCoupon(null)}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>

            {/* Conteúdo da Modal */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">{selectedCoupon.store}</h3>
              <p>{selectedCoupon.description}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleCopyCoupon(selectedCoupon.id)}
                disabled={isCopied}
                className={`w-full px-4 py-2 rounded-lg font-medium ${
                  isCopied 
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {isCopied ? 'Cupom Copiado!' : 'Copiar Cupom'}
              </button>
              
              <button
                onClick={() => openMaps(selectedCoupon)}
                className="w-full px-4 py-2 rounded-lg font-medium border border-primary text-primary hover:bg-primary hover:text-white"
              >
                Me mostre onde é
              </button>

              {/* Botão de visitar site */}
              {(() => {
                const spot = TOURIST_SPOTS.find(s => s.name === selectedCoupon.store);
                if (spot?.website) {
                  return (
                    <a
                      href={spot.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accent-link mt-2 font-light text-center"
                    >
                      Visitar site
                    </a>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 