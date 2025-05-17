import React from 'react';

const MERCHANTS = [
  {
    id: 1,
    name: 'Café Catedral',
    description: 'Cafeteria tradicional próxima à Catedral',
    address: 'Rua Principal, 123',
    category: 'Alimentação'
  },
  {
    id: 2,
    name: 'Lages Souvenirs',
    description: 'Loja de lembranças e artesanato local',
    address: 'Av. Central, 456',
    category: 'Varejo'
  },
  {
    id: 3,
    name: 'Restaurante X',
    description: 'Comida típica serrana',
    address: 'Rua das Araucárias, 789',
    category: 'Alimentação'
  },
  {
    id: 4,
    name: 'Livraria do Museu',
    description: 'Livros sobre história e cultura local',
    address: 'Praça do Museu, 321',
    category: 'Varejo'
  }
];

function Merchants() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Comerciantes Parceiros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MERCHANTS.map(merchant => (
          <div key={merchant.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-2">{merchant.name}</h3>
            <p className="text-gray-600 mb-2">{merchant.description}</p>
            <p className="text-sm text-gray-500">{merchant.address}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
              {merchant.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Merchants; 