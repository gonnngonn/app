import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPaw } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import './inactivos.css';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const ReactivacionModal = ({ isOpen, onClose, mascota, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
      setIsVerifying(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleVerifyPassword = async () => {
    try {
      setIsVerifying(true);
      const response = await api.post('/api/verificar-password', {
        codRefugio: mascota.cod_refugio,
        password: password
      });

      if (response.data.verified) {
        handleReactivarMascota();
      } else {
       enqueueSnackbar('Contraseña incorrecta. Por favor, intenta nuevamente', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        setPassword('')
      }
    } catch (error) {
      enqueueSnackbar('Error al verificar la contraseña', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      setPassword('')
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReactivarMascota = async () => {
    try {
      const fechaActual = new Date().toISOString().split('T')[0];
      await api.put(`/api/mascotas/${mascota.id}/reactivar`, {
        id_estado: 1,
        fecha_subida: fechaActual
      });

      onConfirm();
      enqueueSnackbar('¡Animal devuelto al catálogo exitosamente!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      onClose();
    } catch (error) {
      enqueueSnackbar('Error al reactivar el animal', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    }
  };


  if (!isOpen) return null;

    return (
      <div className="activar-modal-overlay">
        <div className="activar-modal-content">
          <h2>Reactivar a {mascota.nombre}</h2>
          <p className="activar-modal-subtitle">
            Por favor, ingresa su contraseña {mascota.nombre_refugio}
          </p>
          
          {error && <div className="activar-modal-error">{error}</div>}
          
          <div className="password-activar">
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div 
                onClick={togglePasswordVisibility}
                className="toggle-password-activar"
              >
                {showPassword ? '🙈' : '🙉'}
              </div>
            </div>
            <button
              onClick={handleVerifyPassword}
              disabled={!password || isVerifying}
              className="verify-button-activar"
            >
              {isVerifying ? 'Verificando...' : 'Verificar'}
            </button>
            <button
          onClick={onClose}
          className="cancel-button-activar"
        >
          Cancelar
        </button>
          </div>
        </div>
      </div>
    );
  };


const AvailablePetItem = ({ mascota, onReactivar }) => (
  <div className="activar-mascota-card">
    {mascota.imagen_url && (
      <img 
        src={mascota.imagen_url} 
        alt={mascota.nombre} 
        className="activar-mascota-thumbnail" 
      />
    )}
    <div className="activar-mascota-info">
      <p><strong>Cod:</strong> {mascota.cod_refugio || 'No disponible'}</p>
      <p><strong>Nombre:</strong> {mascota.nombre || 'No disponible'}</p>
      <p><strong>Edad:</strong> {mascota.edad || 'No disponible'}</p>
      <p><strong>Sexo:</strong> {mascota.sexo || 'No disponible'}</p>
      <p><strong>Especie:</strong> {mascota.especie || 'No disponible'}</p>
      <p><strong>¿Quien lo alberga?:</strong> {mascota.nombre_refugio || 'No disponible'}</p>
      <p><strong>Estado:</strong> <span className="activar-estado-adoptado">{mascota.estado}</span></p>
      <button 
        className="activar-button-reactivar"
        onClick={() => onReactivar(mascota)}
      >
        Reactivar
      </button>
    </div>
  </div>
);

const GestionReactivacion = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [mascotasInactivas, setMascotasInactivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [filtroRefugio, setFiltroRefugio] = useState("");
  const [codigosRefugio, setCodigosRefugio] = useState([]);

  const fetchCodigosRefugio = async () => {
    try {
      const response = await api.get("/api/refugios/codigos");
      setCodigosRefugio(response.data);
    } catch (error) {
      console.error("Error al obtener códigos de refugio:", error);
      enqueueSnackbar("Error al cargar códigos de refugio", { variant: 'error' });
    }
  };

  const fetchMascotasInactivas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/mascotas/desactivar');
      setMascotasInactivas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener mascotas inactivas:', error);
      if (error.response && error.response.status !== 404) {
        setError('Error al cargar mascotas inactivas');
        enqueueSnackbar("Error al cargar mascotas inactivas", { variant: 'error' });
      } else if (error.response && error.response.status === 404) {
        setMascotasInactivas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascotasInactivas();
    fetchCodigosRefugio();
  }, []);

  const handleReactivar = (mascota) => {
    setSelectedMascota(mascota);
    setModalOpen(true);
  };

  const handleReactivacionConfirmada = () => {
    fetchMascotasInactivas();
  };

  const mascotasFiltradas = filtroRefugio
    ? mascotasInactivas.filter(mascota => mascota.cod_refugio === filtroRefugio)
    : mascotasInactivas;

  if (loading) {
    return <div className="activar-container">Cargando...</div>;
  }

  return (
    <div className="activar-container">
      <div className="activar-navigation-buttons">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="activar-back-button"
        >
          Volver atrás
        </button>
      </div>

      <div className="activar-titulo-container">
        <FaPaw className="activar-patita" />
        <h2>Gestión de Inactivos</h2>
        <FaPaw className="activar-patita2" />
      </div>

      <div className="activar-mascotas-list">
        <div className="activar-filter-container">
          <h3>Listado Animales Inactivos</h3>
          <select
            className="activar-filter-select"
            value={filtroRefugio}
            onChange={(e) => setFiltroRefugio(e.target.value)}
          >
            <option value="">Todos🏠</option>
            {codigosRefugio.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="activar-error">{error}</div>}
        {mascotasFiltradas.length > 0 ? (
          <div className="activar-mascotas-grid">
            {mascotasFiltradas.map((mascota) => (
              <AvailablePetItem 
                key={mascota.id} 
                mascota={mascota} 
                onReactivar={handleReactivar}
              />
            ))}
          </div>
        ) : (
          <div className="activar-no-mascotas">
            No hay aniamles inactivos registradas
          </div>
        )}
      </div>

      <ReactivacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mascota={selectedMascota}
        onConfirm={handleReactivacionConfirmada}
      />
    </div>
  );
};

export default GestionReactivacion;