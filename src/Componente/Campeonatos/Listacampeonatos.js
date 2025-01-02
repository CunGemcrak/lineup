import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Navbar, Button, Modal, Form } from "react-bootstrap";
import { db } from "../../ControllerFirebase/firebase"; // Asegúrate de tener la configuración de Firebase
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

const Listacampeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [nivel, setNivel] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const USUARIO = useSelector((state) => state.USER || null); // Obtener datos del usuario actual

  // Cargar campeonatos desde Firestore
  const fetchCampeonatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "campeonatos"));
      const campeonatosData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((campeonato) => campeonato.idUsuario === USUARIO?.uid); // Filtrar por idUsuario
      setCampeonatos(campeonatosData);
    } catch (error) {
      console.error("Error al cargar los campeonatos: ", error);
    }
  };

  useEffect(() => {
    fetchCampeonatos(); // Llamar a la función para cargar los campeonatos
  }, [USUARIO]);

  // Función para actualizar el campeonato
  const handleUpdate = async () => {
    if (selectedCampeonato) {
      const campeonatoRef = doc(db, "campeonatos", selectedCampeonato.id);
      try {
        await updateDoc(campeonatoRef, {
          nivel: nivel,
          fechaInicio: fechaInicio,
        });
        setShowUpdateModal(false); // Cerrar el modal
        fetchCampeonatos(); // Refrescar los campeonatos
      } catch (error) {
        console.error("Error al actualizar el campeonato: ", error);
      }
    }
  };

  // Función para eliminar el campeonato
  const handleDelete = async (id) => {
    const campeonatoRef = doc(db, "campeonatos", id);
    try {
      await deleteDoc(campeonatoRef);
      fetchCampeonatos(); // Refrescar los campeonatos
    } catch (error) {
      console.error("Error al eliminar el campeonato: ", error);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4 shadow">
        <Container>
          <Navbar.Brand href="#">Lista de Campeonatos</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row>
          {campeonatos.length > 0 ? (
            campeonatos.map((campeonato) => (
              <Col xs={12} md={6} lg={4} className="mb-4" key={campeonato.id}>
                <Card className="shadow">
                  <Card.Body>
                    <Card.Title>{campeonato.nombreCampeonato}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Organizador: {campeonato.organizador}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Primer Apellido:</strong> {campeonato.primerApellido}
                      <br />
                      <strong>Segundo Apellido:</strong> {campeonato.segundoApellido}
                      <br />
                      <strong>Correo organizador:</strong> {campeonato.email || 'null'}
                      <br />
                      <strong>Nivel:</strong> {campeonato.nivel}
                      <br />
                      <strong>Fecha de Inicio:</strong> {campeonato.fechaInicio}
                      <br />
                      <strong>Código del Campeonato:</strong> {campeonato.id}
                    </Card.Text>
                    <Button 
                      variant="warning" 
                      onClick={() => {
                        setSelectedCampeonato(campeonato);
                        setNivel(campeonato.nivel);
                        setFechaInicio(campeonato.fechaInicio);
                        setShowUpdateModal(true);
                      }}
                    >
                      Actualizar
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(campeonato.id)}
                    >
                      Eliminar
                    </Button>{" "}
              
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No hay campeonatos registrados para este usuario.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Modal para actualizar campeonato */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Campeonato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nivel">
              <Form.Label>Nivel</Form.Label>
              <Form.Control
                type="text"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Actualizar
          </Button>
         
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Listacampeonatos;
