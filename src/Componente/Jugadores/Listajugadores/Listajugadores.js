import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

import { db } from '../../../ControllerFirebase/firebase'; // Importa tu configuración de Firebase
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const Listajugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempData, setTempData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchPlayersFromFirestore = async () => {
      try {
        const jugadoresCollection = collection(db, 'jugadoresatleticos');
        const snapshot = await getDocs(jugadoresCollection);
        const jugadoresList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJugadores(jugadoresList);
      } catch (error) {
        console.error('Error al obtener jugadores desde Firestore:', error);
        alertify.error('Error al cargar los jugadores.');
      }
    };

    fetchPlayersFromFirestore();
  }, []);

  const handleDelete = (index) => {
    const jugador = jugadores[index];
    alertify.confirm(
      'Confirmar Eliminación',
      `¿Estás seguro de que deseas eliminar a ${jugador.nombre}?`,
      () => {
        const updatedJugadores = [...jugadores];
        updatedJugadores[index].eliminado = true;
        setJugadores(updatedJugadores);
        alertify.success('El jugador ha sido eliminado (bloqueado).');
      },
      () => {
        alertify.error('Acción cancelada.');
      }
    );
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempData({ ...jugadores[index] });
    setPreviewImage(jugadores[index].imagen);
  };

  const handleSave = async (index) => {
    try {
      const jugador = tempData;
      const jugadorRef = doc(db, 'jugadoresatleticos', jugador.id);

      await updateDoc(jugadorRef, jugador);

      const updatedJugadores = [...jugadores];
      updatedJugadores[index] = { ...tempData, eliminado: false };
      setJugadores(updatedJugadores);

      setEditingIndex(null);
      setPreviewImage(null);
      alertify.success('Los cambios han sido guardados en Firestore.');
    } catch (error) {
      console.error('Error al guardar cambios en Firestore:', error);
      alertify.error('Error al guardar los cambios.');
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempData({});
    setPreviewImage(null);
    alertify.error('Edición cancelada.');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setTempData({ ...tempData, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const sortedJugadores = jugadores.sort((a, b) => {
    if (a.eliminado !== b.eliminado) {
      return a.eliminado ? 1 : -1; // Los eliminados al final
    }
    return a.cont - b.cont; // Orden por `cont`
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lista de Jugadores</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {sortedJugadores.map((jugador, index) => (
          <Col key={jugador.id || jugador.cont}>
            <Card
              style={{
                border: jugador.eliminado ? '2px solid #f5c6cb' : '1px solid #ccc',
              }}
            >
              <Card.Img
                variant="top"
                src={
                  editingIndex === index && previewImage
                    ? previewImage
                    : jugador.imagen
                }
                alt={`${jugador.nombre} ${jugador.papellido}`}
                style={{
                  height: '150px',
                  objectFit: 'cover',
                  backgroundColor: '#f8f9fa',
                }}
              />
              <Card.Body>
                <Card.Title>
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        name="nombre"
                        value={tempData.nombre}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        name="papellido"
                        value={tempData.papellido}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        name="sapellido"
                        value={tempData.sapellido}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      />
                    </>
                  ) : (
                    <>
                      {jugador.nombre}
                      <br />
                      {jugador.papellido} {jugador.sapellido}
                    </>
                  )}
                </Card.Title>
                <Card.Text>
                  <strong>Nivel:</strong>{' '}
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="nivel"
                      value={tempData.nivel}
                      onChange={handleChange}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    jugador.nivel
                  )}
                  <br />
                  <strong>Número de Camisa:</strong>{' '}
                  {editingIndex === index ? (
                    <input
                      type="number"
                      name="numerocamisa"
                      value={tempData.numerocamisa}
                      onChange={handleChange}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    jugador.numerocamisa
                  )}
                  <br />
                  <strong>Fecha de Nacimiento:</strong>{' '}
                  {editingIndex === index ? (
                    <input
                      type="date"
                      name="fechanacimiento"
                      value={tempData.fechanacimiento}
                      onChange={handleChange}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    jugador.fechanacimiento
                  )}
                  {editingIndex === index && (
                    <>
                      <strong>Imagen:</strong>{' '}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ width: '100%' }}
                      />
                    </>
                  )}
                </Card.Text>
                {editingIndex === index ? (
                  <>
                    <Button
                      variant="success"
                      onClick={() => handleSave(index)}
                      className="me-2"
                      size="sm"
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(index)}
                      className="me-2"
                      size="sm"
                      disabled={jugador.eliminado}
                    >
                      Actualizar
                    </Button>
                    {/*<Button
                      variant="danger"
                      onClick={() => handleDelete(index)}
                      size="sm"
                      disabled={jugador.eliminado}
                    >
                      Eliminar
                    </Button>*/}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Listajugadores;
