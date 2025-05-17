import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleMapClick = () => {
    setIsOpen(false);
    navigate('/merchants');
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="welcome-message">
          <h1>Bem-vindo ao Locall!</h1>
          <p>Descubra os melhores pontos turísticos e comerciantes locais da sua região. 
             Uma experiência única de conexão com sua cidade e sua comunidade.</p>
        </div>
        <img 
          src="/Visite Pontos Turísticos (1).png" 
          alt="Pontos Turísticos"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <button className="map-button" onClick={handleMapClick}>
          Seguir para o mapa
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup; 