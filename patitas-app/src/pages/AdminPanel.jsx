import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPaw } from 'react-icons/fa';
import './panel.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSnackbar, SnackbarProvider } from 'notistack';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const CLOUDINARY_CONFIG = {
  cloudName: 'dukljwnwm',
  uploadPreset: 'Mascotas'
};


// Modales
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// confirmacion 
const DeleteDialog = ({ isOpen, onClose, onConfirm, codRefugio }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    setError(''); 
  }, [password]);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/api/verificar-password', {
        codRefugio,
        password
      });
      
      if (response.data.verified) {
        onConfirm();
        setPassword('');
        setError('');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (error) {
      setError('Error al verificar la contraseña');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <h2>Verificar Contraseña</h2>
      </div>
      <div className="modal-body" style={{ position: 'relative' }}>
      <input
  type={showPassword ? 'text' : 'password'}
  placeholder="Ingrese la contraseña "
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    setError('');
  }}
  className="modal-input"
/>
        <span 
          className="show-password-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
        {error && <p className="modal-error">{error}</p>}
      </div>
      <div className="modal-footer">
        <button className="modal-button secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="modal-button primary" onClick={handleSubmit}>
          Verificar
        </button>
      </div>
    </Modal>
  );
};


const AdoptionDialog = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="modal-header">
      <h2>🐱Confirmar Adopción🐶</h2>
    </div>
    <div className="modal-body">
      <p>Al presionar "SI" sera movido a "GESTION DE ADOPCIONES"  </p> 
    </div>
    <div className="modal-footer">
      <button 
        className="modal-button secondary" 
        onClick={onClose} 
      >
        Cancelar
      </button>
      <button 
        className="modal-button primary" 
        onClick={() => onConfirm(true)}
      >
        Sí
      </button>
    </div>
  </Modal>
  
);
const DeactivationDialog = ({ isOpen, onClose, onConfirm, codRefugio }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/api/verificar-password', {
        codRefugio,
        password
      });
      
      if (response.data.verified) {
        onConfirm();
        setPassword('');
        setError('');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (error) {
      setError('Error al verificar la contraseña');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <h2>Verificar Contraseña</h2>
      </div>
      <div className="modal-body" style={{ position: 'relative' }}>
      <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Ingrese la contraseña "
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          className="modal-input"
      />
        <span 
          className="show-password-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
        {error && <p className="modal-error">{error}</p>}
      </div>
      <div className="modal-body">
        <p>Al confirmar sera movido a "Patitas Inactivas"</p>
      </div>
      <div className="modal-footer">
        <button className="modal-button secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="modal-button primary" onClick={handleSubmit}>
          Sí
        </button>
      </div>
    </Modal>
  );
};

const ImageUploader = ({ onImageUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      );
      onImageUpload(response.data.secure_url);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
    </div>
  );
};

const PetListItem = ({ mascota, onEdit, onDelete, onDeactivate  }) => (
  <div className="panel-mascota-item">
    {mascota.imagen_url && (
      <img 
        src={mascota.imagen_url} 
        alt={mascota.nombre} 
        className="panel-mascota-thumbnail" 
      />
    )}
    <div className="panel-mascota-info">
      <p><strong>Cod:</strong> {mascota.cod_refugio || 'No disponible'}</p>
      <p><strong>Nombre:</strong> {mascota.nombre || 'No disponible'}</p>
      <p><strong>Edad:</strong> {mascota.edad || 'No disponible'}</p>
      <p><strong>Sexo:</strong> {mascota.sexo || 'No disponible'}</p>
      <p><strong>Especie:</strong> {mascota.especie || 'No disponible'}</p>
    </div>
    <div className="panel-button-group">
      <button 
        className="panel-edit-button" 
        onClick={() => onEdit(mascota)}
      >
        Editar
      </button>
      <button 
        className="panel-delete-button" 
        onClick={() => onDelete(mascota)}
      >
        ¡Adoptado!​ 
       </button>
      <button 
        className="panel-deactivate-button" 
        onClick={() => onDeactivate(mascota)}
      >
        Desactivar
      </button>
    </div>
  </div>
);

// MAIN
const AdminPanel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const initialFormState = {
    Nombre: '',
    Especie: '',
    Edad: '',
    Sexo: '',
    Descripcion: '',
    Telefono: '',
    CodRefugio: '',
    ImagenUrl: ''
  };
  const [mascotas, setMascotas] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId, ] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adoptionDialogOpen, setAdoptionDialogOpen] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codigosRefugio, setCodigosRefugio] = useState([]);
  const [filtroRefugio, setFiltroRefugio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deactivationDialogOpen, setDeactivationDialogOpen] = useState(false);
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [isNeutered, setIsNeutered] = useState(false);
 
  
 
  const fetchCodigosRefugio = () => {
    axios
      .get("http://localhost:5000/api/refugios/codigos")
      .then((response) => {
        setCodigosRefugio(response.data);
      })
      .catch((error) =>
        console.error("Error al obtener códigos de refugio:", error)
      );
  };
  useEffect(() => {
    fetchMascotas();
    fetchCodigosRefugio();
  }, []);
  const handleNavigation = (path) => {
    navigate(path); 
  };

  const handleBack = () => {
    handleNavigation('/dashboard');
  };

  const handleSaveAndLogout = () => {
    handleNavigation('/');
  };
 
  const validateEdad = (edad) => {
    const edadRegex = /^(\d+)\s*(años?|meses?|días?)$/i;
    return edadRegex.test(edad);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImageUrl('');
    setEditingId(null);
    setError(null);
    setMessage(null);
    setIsVaccinated(false);
    setIsNeutered(false);
  };
  const handleDeactivationProcess = async (confirmed) => {
  if (!confirmed || !selectedMascota) {
    setDeactivationDialogOpen(false);
    return;
  }

  try {
    const response = await api.put(`/api/mascotas/${selectedMascota.id}/desactivar`, {
      id_estado: 2 
    });

    if (response.status === 200) {
      enqueueSnackbar("Animal desactivado exitosamente", {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      await fetchMascotas(); 
      setDeactivationDialogOpen(false);
    }
  } catch (error) {
    enqueueSnackbar("Error al desactivar el animal", {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
    console.error('Error:', error);
  }
};

  const fetchMascotas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/mascotas?estado=disponible');
      setMascotas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      setError('Error al cargar. Por favor, intente nuevamente.');
      setMascotas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionProcess = async (confirmed) => {
  if (!confirmed || !selectedMascota) {
    setAdoptionDialogOpen(false);
    return;
  }

  try {
    const response = await api.put(`/api/mascotas/${selectedMascota.id}/adoptar`, {
      id_estado: 3 
    });

    if (response.status === 200) {
      enqueueSnackbar("Animal marcado como adoptado exitosamente", {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      await fetchMascotas(); 
      setAdoptionDialogOpen(false);
      
    }
  } catch (error) {
    enqueueSnackbar("Error al procesar la adopción", {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
    console.error('Error:', error);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setMessage(null);
  };

  const handleImageUpload = (url) => {
    setImageUrl(url);
    setFormData(prev => ({ ...prev, ImagenUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEdad(formData.Edad)) {
      setError('Formato de edad inválido. Use por ejemplo "2 años" o "9 meses".');
      return;
    } 
    const descriptionWithMarkers = `${formData.Descripcion} ¿Tengo mis vacunas al día? ${isVaccinated ? 'Sí' : 'No'} ¿Estoy castrado/a? ${isNeutered ? 'Sí' : 'No'}`;

    const dataToSend = {
      nombre: formData.Nombre,
      especie: formData.Especie,
      edad: formData.Edad,
      sexo: formData.Sexo,
      descripcion:  descriptionWithMarkers,
      numero_contacto: formData.Telefono,
      cod_refugio: formData.CodRefugio,
      imagen_url: formData.ImagenUrl || null,
      estado: 'disponible'
    };
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  

    try {
      if (editingId) {
        await api.put(`/api/mascotas/${editingId}`, dataToSend);
        enqueueSnackbar("Animal actualizado exitosamente", {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        await api.post('/api/mascotas', dataToSend);
        enqueueSnackbar("Animal agregado exitosamente", {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
      
      resetForm();
      await fetchMascotas();
    } catch (error) {
      enqueueSnackbar('Error al guardar el animal:', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      enqueueSnackbar(error.response?.data?.message || 'Ocurrió un error al guardar', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
  };

 
  const handleEdit = (mascota) => {
    const hasVaccines = description.includes('¿Tengo mis vacunas al día? Sí');
    const isNeuteredPet = description.includes('¿Estoy castrado/a? Sí');

    const cleanDescription = description
    .replace(/¿Tengo mis vacunas al día\? (Sí|No)/g, '')
    .replace(/¿Estoy castrado\/a\? (Sí|No)/g, '')
    .trim();

    setFormData({
      Nombre: mascota.nombre,
      Especie: mascota.especie,
      Edad: mascota.edad,
      Sexo: mascota.sexo,
      Descripcion: cleanDescription,
      Telefono: mascota.numero_contacto || '',
      CodRefugio: mascota.cod_refugio,
      ImagenUrl: mascota.imagen_url || ''
    });

    setIsVaccinated(hasVaccines);
    setIsNeutered(isNeuteredPet);
    setImageUrl(mascota.imagen_url || '');
    setEditingId(mascota.id);
    setError(null);
    setMessage(null);
    navigateToTop();
  };
 
const handleDeactivationClick = (mascota) => {
  setSelectedMascota(mascota);
  setDeactivationDialogOpen(true);
};

  const handleDeleteClick = (mascota) => {
    setSelectedMascota(mascota);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return <div className="panel-container">Cargando...</div>;
  }
 
  const mascotasFiltradas = mascotas.filter(
    (mascota) => filtroRefugio === "" || mascota.cod_refugio === filtroRefugio
  );

  if (loading) {
    return <div className="panel-container">Cargando...</div>;
  }
 


  return (
    <div className="panel-container">
      <div id="top"></div>
      <div className="navigation-buttons">
        <button onClick={handleBack} className="back-button">
          Volver atrás
        </button>
        <button onClick={handleSaveAndLogout} className="back-button">
          Guardar cambios y cerrar sesión
        </button>
      </div>
      <div className="panel-titulo-container">
        <FaPaw className="panel-patita" />
        <h2>Administración de Animales</h2>
        <FaPaw className="panel-patita2" />
      </div>
  
      <div className="panel-titulo2">
        <h3>{editingId ? 'Modificar' : 'Añadir'} </h3>
      </div>
  
      <form className="panel-form" onSubmit={handleSubmit}>
        <select 
          className="panel-input" 
          name="CodRefugio" 
          value={formData.CodRefugio} 
          onChange={handleInputChange} 
          required
        >
          <option value="">Seleccione su codigo</option>
          {codigosRefugio.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo}
            </option>
          ))}
        </select>
        <input 
          className="panel-input" 
          name="Nombre" 
          value={formData.Nombre} 
          onChange={handleInputChange} 
          placeholder="Nombre" 
          required 
        />
        <select 
          className="panel-input" 
          name="Especie" 
          value={formData.Especie} 
          onChange={handleInputChange} 
          required
        >
          <option value="">Seleccione especie</option>
          <option value="Canina">Canino</option>
          <option value="Felina">Felino</option>
        </select>
        <input 
          className="panel-input" 
          name="Edad" 
          value={formData.Edad} 
          onChange={handleInputChange} 
          placeholder="Edad (ej. 2 años, 9 meses)" 
          required 
        />
        <select 
          className="panel-input" 
          name="Sexo" 
          value={formData.Sexo} 
          onChange={handleInputChange} 
          required
        >
          <option value="">Seleccione sexo</option>
          <option value="Hembra">Hembra</option>
          <option value="Macho">Macho</option>
        </select>
  
        <div className="descripcion-container">
          <div className="checkboxes-container">
            <label>
              <input
                type="checkbox"
                checked={isVaccinated}
                onChange={(e) => setIsVaccinated(e.target.checked)}
              /> Vacunas al día
            </label>
            <label>
              <input
                type="checkbox"
                checked={isNeutered}
                onChange={(e) => setIsNeutered(e.target.checked)}
              /> Castrado/a
            </label>
          </div>
          <textarea 
            className="panel-textarea" 
            name="Descripcion" 
            value={formData.Descripcion} 
            onChange={handleInputChange} 
            placeholder="Descripción" 
            required 
          />
        </div>
  
        <input 
          className="panel-input" 
          name="Telefono" 
          value={formData.Telefono} 
          onChange={handleInputChange} 
          placeholder="Número de contacto" 
        />
        <ImageUploader onImageUpload={handleImageUpload} />
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Preview" 
            style={{width: '100px', height: '100px', objectFit: 'cover'}} 
          />
        )}
        <button className="panel-submit-button" type="submit">
          {editingId ? 'Actualizar' : 'Añadir'} 
        </button>
        {editingId && (
          <button 
            className="panel-cancel-button" 
            type="button" 
            onClick={resetForm}
          >
            Cancelar Edición
          </button>
        )}
      </form>
  
      <div className="panel-mascotas-list">
        <div className="panel-filter-container">
          <h3>Listado de animales disponibles para su adopcion</h3>
          <select
            className="panel-filter-select"
            value={filtroRefugio}
            onChange={(e) => setFiltroRefugio(e.target.value)}
          >
            <option value="">Todos</option>
            {codigosRefugio.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
        </div>
  
        {mascotasFiltradas.length > 0 ? (
          mascotasFiltradas.map((mascota) => (
            <PetListItem
              key={mascota.id}
              mascota={mascota}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onDeactivate={handleDeactivationClick}
            />
          ))
        ) : (
          <p className="panel-no-mascotas">No hay mascotas disponibles</p>
        )}
      </div>
  
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          setDeleteDialogOpen(false);
          setAdoptionDialogOpen(true);
        }}
        codRefugio={selectedMascota?.cod_refugio}
      />
      
      <AdoptionDialog
        isOpen={adoptionDialogOpen}
        onClose={() => setAdoptionDialogOpen(false)}
        onConfirm={handleAdoptionProcess}
      />
      <DeactivationDialog
        isOpen={deactivationDialogOpen}
        onClose={() => setDeactivationDialogOpen(false)}
        onConfirm={() => handleDeactivationProcess(true)}
        codRefugio={selectedMascota?.cod_refugio}
      />
    </div>
  )};
export default AdminPanel;