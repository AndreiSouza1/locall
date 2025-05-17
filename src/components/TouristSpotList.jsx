import React from 'react';

function TouristSpotList({ spots, onCheckIn, checkedInSpots, nearbySpots }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pontos Turísticos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spots.map(spot => {
          const isCheckedIn = checkedInSpots.includes(spot.id);
          const isNearby = nearbySpots.includes(spot.id);

          return (
            <div
              key={spot.id}
              className={`p-4 rounded-lg shadow ${
                isNearby ? 'bg-green-50 border-2 border-green-500' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
            <div>
                  <h3 className="text-xl font-semibold">{spot.name}</h3>
                  <p className="text-gray-600 mt-1">{spot.description}</p>
            </div>
            <button
              onClick={() => onCheckIn(spot.id)}
                  disabled={isCheckedIn}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isCheckedIn
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
            >
                  {isCheckedIn ? 'Check-in feito' : 'Fazer Check-in'}
            </button>
              </div>
              {isNearby && !isCheckedIn && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Você está próximo! Faça check-in para desbloquear cupons.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TouristSpotList; 