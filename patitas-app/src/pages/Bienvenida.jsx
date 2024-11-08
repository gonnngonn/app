import React from 'react';
import { Clipboard, BarChart2, PawPrint, LogOut, ListFilter } from 'lucide-react';
import './bienvenida.css';
import { useNavigate } from 'react-router-dom';
import inactivosIcon from '../assets/images/inactivos.png';
import icoAdop from '../assets/images/ico-adop.png';
import icoEstado from '../assets/images/ico-estado.png';

const BienvenCard = ({ children, onClick }) => (
  <div className="bienven-card" onClick={onClick}>
    {children}
  </div>
);

const BienvenCardContent = ({ children }) => (
  <div className="bienven-card-content">
    {children}
  </div>
);

const Bienvenida = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bienven-container">
      <div className="bienven-wrapper">
        <div className="bienven-header">
          <div className="bienven-icon-main">
            <PawPrint />
          </div>
          <h1 className="bienven-title">
            ¡Bienvenido/a! 🐾
          </h1>
          <p className="bienven-subtitle">
            ¿Qué aventura quieres comenzar hoy?
          </p>
        </div>
        
        <div className="bienven-grid">
          <BienvenCard onClick={() => navigate('/admin')}>
            <BienvenCardContent>
              <div className="icon-admin">
                <img 
                  src={icoAdop} 
                  alt="Administrar" 
                  className="admin-icon"
                />
              </div>
              <h2 className="card-title">Administrar Patitas</h2>
              <p className="card-description">
                Añade, actualiza, modifica, elimina patitas🐱🐶
              </p>
            </BienvenCardContent>
          </BienvenCard>

          <BienvenCard onClick={() => navigate('/gestion-activar')}>
            <BienvenCardContent>
              <div className="icon">
                <img
                  src={inactivosIcon}
                  alt="Inactivos"
                  className="custom-icon"
                />
              </div>
              <h2 className="card-title-inac">Administrar Patitas Inactivas</h2>
              <p className="card-description">
                ¡Dales una nueva oportunidad! Reactiva las Patitas inactivas 🐱🐶
              </p>
            </BienvenCardContent>
          </BienvenCard>

          <BienvenCard onClick={() => navigate('/estadisticas')}>
            <BienvenCardContent>
              <div className="icon-container purple">
                <BarChart2 />
              </div>
              <h2 className="card-title">Estadísticas Colaborativas</h2>
              <p className="card-description">
                Descubre el impacto de nuestras adopciones 📊
              </p>
            </BienvenCardContent>
          </BienvenCard>

          <BienvenCard onClick={() => navigate('/adopciones')}>
            <BienvenCardContent>
              <div className="icon-container green">
                <PawPrint />
              </div>
              <h2 className="card-title">Gestión de Adopciones</h2>
              <p className="card-description">
                Republicar y ver adopciones 🏠
              </p>
            </BienvenCardContent>
          </BienvenCard>

          <BienvenCard onClick={() => navigate('/estado')}>
            <BienvenCardContent>
              <div className="icon-container orange">
                <img 
                  src={icoEstado} 
                  alt="Estado" 
                  className="estado-icon"
                />
              </div>
              <h2 className="card-title">Estado de las patitas</h2>
              <p className="card-description">
                Visualiza y filtra el estado de todas las patitas 🔍
              </p>
            </BienvenCardContent>
          </BienvenCard>
        </div>

        <button className="logout-button" onClick={() => navigate('/')}>
          <LogOut />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Bienvenida;