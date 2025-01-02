import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {actualizarUsuario } from '../../Redux/actions'
import Loading from '../Loading/Loading';
const PerfilUsuario = () => {
  const USER = useSelector((state) => state?.USER || null);
  const [editedData, setEditedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showComponent , setShowComponent] = useState(true)
      useEffect(() => {
              // Mostrar el componente
              setShowComponent(true);
          
              // Ocultar el componente después de 2 segundos
              const timer = setTimeout(() => {
                  setShowComponent(false);
              }, 1000);
          
              // Limpiar el temporizador si el componente se desmonta
              return () => clearTimeout(timer);
          }, []); 





  const [privacySettings, setPrivacySettings] = useState({
    visibleParaTodos: false,
    visibleParaDelegados: false,
    visibleParaEquipo: false,
  });

  useEffect(() => {
    if (USER) {
      setEditedData(USER);
      // Asumimos que las configuraciones de privacidad vienen del usuario
      // Si no es así, puedes inicializarlas aquí o manejarlas de otra manera
      setPrivacySettings(USER.privacySettings || {
        visibleParaTodos: false,
        visibleParaDelegados: false,
        visibleParaEquipo: false,
      });
    }
  }, [USER]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(USER);
    setPrivacySettings(USER.privacySettings || {
      visibleParaTodos: false,
      visibleParaDelegados: false,
      visibleParaEquipo: false,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editedData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!editedData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(editedData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!editedData.papellido?.trim()) {
      newErrors.papellido = 'El primer apellido es requerido';
    }

    if (!editedData.sapellido?.trim()) {
      newErrors.sapellido = 'El segundo apellido es requerido';
    }

    if (!editedData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Aquí deberías implementar la lógica para guardar los cambios
      // Incluyendo las nuevas configuraciones de privacidad
      console.log('Datos editados:', editedData);
      console.log('Configuraciones de privacidad:', privacySettings);
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setPrivacySettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditedData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!USER || !editedData) {
    return <div>Cargando perfil de usuario...</div>;
  }

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: '500px', backgroundColor: '#ffffff', color: '#000000' }}>
      {showComponent ?<Loading/>:null}
      <Card.Body>
        <Card.Title className="text-center mb-4" style={{ color: '#000000' }}>Perfil de Usuario</Card.Title>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={isEditing ? editedData.nombre : USER.nombre}
              onChange={handleChange}
              disabled={!isEditing}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="papellido"
              value={isEditing ? editedData.papellido : USER.papellido}
              onChange={handleChange}
              disabled={!isEditing}
              isInvalid={!!errors.papellido}
            />
            <Form.Control.Feedback type="invalid">{errors.papellido}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              type="text"
              name="sapellido"
              value={isEditing ? editedData.sapellido : USER.sapellido}
              onChange={handleChange}
              disabled={!isEditing}
              isInvalid={!!errors.sapellido}
            />
            <Form.Control.Feedback type="invalid">{errors.sapellido}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={isEditing ? editedData.email : USER.email}
              onChange={handleChange}
              disabled={!isEditing}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={isEditing ? editedData.fechaNacimiento : USER.fechaNacimiento}
              onChange={handleChange}
              disabled={!isEditing}
              isInvalid={!!errors.fechaNacimiento}
            />
            <Form.Control.Feedback type="invalid">{errors.fechaNacimiento}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nivel</Form.Label>
            <Form.Control
              type="text"
              name="nivel"
              value={isEditing ? editedData.nivel : USER.nivel}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              name="tipo"
              value={USER.tipo}
              onChange={handleChange}
              disabled={true}
            />
          </Form.Group>
          
          <Form.Group className="mb-3 justify-content-start text-sm-start">
            <Form.Label className='mb-3 text-center'>Configuración de Privacidad</Form.Label>
            <div>
              <Form.Check 
                type="checkbox"
                id="visibleParaTodos"
                name="visibleParaTodos"
                label="Visible para todos"
                checked={privacySettings.visibleParaTodos}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Form.Check 
                type="checkbox"
                id="visibleParaDelegados"
                name="visibleParaDelegados"
                label="Visible para delegados"
                checked={privacySettings.visibleParaDelegados}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Form.Check 
                type="checkbox"
                id="visibleParaEquipo"
                name="visibleParaEquipo"
                label="Visible para el equipo"
                checked={privacySettings.visibleParaEquipo}
                onChange={handleChange}
                disabled={!isEditing}
                
              />
            </div>
          </Form.Group>

          {!isEditing ? (
            <Button variant="warning" onClick={handleEdit} className="w-100">
              Actualizar
            </Button>
          ) : (
            <div className="d-flex justify-content-between">
              <Button variant="success" onClick={handleSave} className="flex-grow-1 me-2">
                Guardar
              </Button>
              <Button variant="danger" onClick={handleCancel} className="flex-grow-1">
                Cancelar
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PerfilUsuario;

