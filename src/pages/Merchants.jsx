import React, { useState } from 'react';

function EstabelecimentoForm() {
  const [formData, setFormData] = useState({
    nome: '',
    logo: null,
    cnpj: '',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    // Aqui você pode enviar os dados para um backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome do Estabelecimento:</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Logo:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <div>
        <label>CNPJ:</label>
        <input
          type="text"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          pattern="\d{14}"
          title="CNPJ deve conter 14 dígitos"
          required
        />
      </div>

      <div>
        <label>Latitude:</label>
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Longitude:</label>
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}

export default EstabelecimentoForm;
