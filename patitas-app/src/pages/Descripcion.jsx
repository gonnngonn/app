import Navbar from '../components/Navbar';
import './descripcion.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const MascotaDetalle = () => {
  const [mascota, setMascota] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mascotas/${id}`);
        setMascota(response.data);
      } catch (error) {
        setError('Error al cargar la información del animal. Por favor, intente nuevamente más tarde.');
      }
    };
    fetchMascota();
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (!mascota) return <div className="loading-message">Cargando información del animal...</div>;

  const parseDescription = (fullDescription) => {
    const vaccinationMatch = fullDescription.match(/¿Tengo mis vacunas al día\? (Sí|No)/);
    const neuteredMatch = fullDescription.match(/¿Estoy castrado\/a\? (Sí|No)/);
    
    
    let mainDescription = fullDescription
      .replace(/¿Tengo mis vacunas al día\? (Sí|No)/g, '')
      .replace(/¿Estoy castrado\/a\? (Sí|No)/g, '')
      .trim();

    return {
      mainDescription,
      vaccinated: vaccinationMatch ? vaccinationMatch[0] : '',
      neutered: neuteredMatch ? neuteredMatch[0] : ''
    };
  };

  const { mainDescription, vaccinated, neutered } = parseDescription(mascota.descripcion || '');

  return (
    <div className="pagina-contenedor">
      <Navbar />
      <div className="mascota-detalle-pagina">
        <div className="mascota-detalle-contenedor">
          <div className="mascota-imagenes-contenedor">
            {mascota.imagen_url ? (
              <img src={mascota.imagen_url} alt={mascota.nombre} className="mascota-imagen-principal" />
            ) : (
              <p>No hay imagen disponible</p>
            )}
          </div>
          <div className="mascota-info-contenedor">
            <h1 className="mascota-nombre">{mascota.nombre}</h1>
            <h5 className='mascota-codigo'>Cod: {mascota.cod_refugio}</h5>
            <div className="mascota-detalles">
              <p><strong>Especie:</strong> {mascota.especie}</p>
              <p><strong>Edad:</strong> {mascota.edad}</p>
              <p><strong>Sexo:</strong> {mascota.sexo}</p>
              <div className="mascota-descripcion">
                <p><strong>Más sobre mí:</strong> {mainDescription}</p>
                {vaccinated && <p><strong>{vaccinated}</strong></p>}
                {neutered && <p><strong>{neutered}</strong></p>}
              </div>
            </div>
            <p className="whatsapp">
              Envía un WhatsApp al {mascota.numero_contacto} preguntando por {mascota.nombre}!
            </p>
            <div className="button-container">
              <Link to="/adoptar" className="volver-btn">Volver al listado</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MascotaDetalle;