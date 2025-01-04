import React, { useEffect, useState, useCallback } from "react";
import { Card, Container, Row, Col, Navbar, Button, Modal, Form } from "react-bootstrap";
import { db } from "../../ControllerFirebase/firebase"; // Configuración de Firebase
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

const Listacampeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [nivel, setNivel] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const USUARIO = useSelector((state) => state.USER || null); // Obtener datos del usuario actual

  // Cargar campeonatos desde Firestore
  const fetchCampeonatos = useCallback(async () => {
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
  }, [USUARIO]);

  useEffect(() => {
    fetchCampeonatos(); // Llamar a la función para cargar los campeonatos
  }, [USUARIO, fetchCampeonatos]);

  // Función para actualizar el campeonato
  const handleUpdate = async () => {
    if (!selectedCampeonato || !nivel || !fechaInicio) {
      console.error("Por favor, complete todos los campos.");
      return;
    }
  
    try {
      // Crear la consulta para buscar el campeonato por nombre
      const q = query(
        collection(db, "campeonatos"),
        where("nombreCampeonato", "==", selectedCampeonato.nombreCampeonato)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Si se encuentran documentos con ese nombre, actualizarlos
      querySnapshot.forEach(async (docSnapshot) => {
        const campeonatoRef = doc(db, "campeonatos", docSnapshot.id); // Obtener la referencia del documento usando el ID
        await updateDoc(campeonatoRef, {
          nivel: nivel,
          fechaInicio: fechaInicio,
        });
  
        console.log(`El campeonato con nombre ${selectedCampeonato.nombreCampeonato} ha sido actualizado correctamente.`);
        alert(`El campeonato con nombre ${selectedCampeonato.nombreCampeonato} ha sido actualizado correctamente.`);
        setShowUpdateModal(false); // Cerrar el modal
        fetchCampeonatos(); // Refrescar los campeonatos
      });
  
      // Si no se encontró el campeonato
      if (querySnapshot.empty) {
        alert(`No se encontró el campeonato con nombre ${selectedCampeonato.nombreCampeonato}.`);
      }
    } catch (error) {
      console.error("Error al actualizar el campeonato: ", error);
      alert("Hubo un error al intentar actualizar el campeonato. Por favor, inténtalo de nuevo.");
    }
  };
  

  // Función para eliminar el campeonato
  const handleDelete = async (nombreCampeonato) => {
    if (!nombreCampeonato) {
      console.error("No se proporcionó un nombre válido para eliminar.");
      return;
    }

    try {
      // Crear la consulta para buscar el campeonato por nombre
      const q = query(collection(db, "campeonatos"), where("nombreCampeonato", "==", nombreCampeonato));
      const querySnapshot = await getDocs(q);

      // Si se encuentran documentos con ese nombre, eliminarlos
      querySnapshot.forEach(async (docSnapshot) => {
        const campeonatoRef = doc(db, "campeonatos", docSnapshot.id); // Obtener la referencia del documento
        await deleteDoc(campeonatoRef); // Eliminar el documento
        console.log(`El campeonato con nombre ${nombreCampeonato} ha sido eliminado correctamente.`);
        alert(`El campeonato con nombre ${nombreCampeonato} ha sido eliminado correctamente.`);
        fetchCampeonatos(); // Refrescar los campeonatos después de eliminar
      });

      // Si no se encontró el campeonato
      if (querySnapshot.empty) {
        alert(`No se encontró el campeonato con nombre ${nombreCampeonato}.`);
      }
    } catch (error) {
      console.error("Error al eliminar el campeonato: ", error);
      alert("Hubo un error al intentar eliminar el campeonato. Por favor, inténtalo de nuevo.");
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
                    </Button>{" "}
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(campeonato.nombreCampeonato)} // Eliminar por nombre
                    >
                      Eliminar
                    </Button>
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
           
 <Form.Group className="mb-3">
                    <Form.Label>Nivel</Form.Label>
                    <Form.Select
                      value={nivel}
                      onChange={(e) => setNivel(e.target.value)}>
                      <option>Novato</option>
                      <option>Novato Ascenso</option>
                      <option>Regular</option>
                      <option>Regular Fuerte</option>
                      <option>Fuerte</option>
                    </Form.Select>
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
