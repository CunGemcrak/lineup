import React, { useEffect, useState } from "react";
import { Card, Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import { db } from "../../ControllerFirebase/firebase"; // Firebase config
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Listaequipos = () => {
  const USUARIO = useSelector((state) => state.USER || null); // Obtener datos del usuario actual
  const [equipos, setEquipos] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [nombreEquipo, setNombreEquipo] = useState("");
  const navigate = useNavigate()

  // Obtener equipos del usuario actual
  const fetchEquipos = async () => {
    try {
      const q = query(collection(db, "Equipos"), where("uidUsuario", "==", USUARIO.uid));
      const querySnapshot = await getDocs(q);
      const equiposData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipos(equiposData);
    } catch (error) {
      console.error("Error al cargar los equipos: ", error);
    }
  };
  

  useEffect(() => {
    fetchEquipos();
  }, [USUARIO]);

  // Eliminar equipo
  const handleDelete = async (idEquipo) => {
    try {
      const equipoRef = doc(db, "Equipos", idEquipo);
      await deleteDoc(equipoRef);
      alert("Equipo eliminado correctamente.");
      fetchEquipos(); // Actualizar la lista de equipos
    } catch (error) {
      console.error("Error al eliminar el equipo: ", error);
      alert("Hubo un error al eliminar el equipo.");
    }
  };

  // Abrir el modal de actualización
  const handleOpenUpdateModal = (equipo) => {
    setSelectedEquipo(equipo);
    setNombreEquipo(equipo.nombreEquipo);
    setShowUpdateModal(true);
  };

  // Actualizar equipo
  const handleUpdate = async () => {
    if (!nombreEquipo) {
      alert("El nombre del equipo no puede estar vacío.");
      return;
    }

    try {
      const equipoRef = doc(db, "Equipos", selectedEquipo.id);
      await updateDoc(equipoRef, { nombreEquipo });
      alert("Equipo actualizado correctamente.");
      setShowUpdateModal(false);
      fetchEquipos(); // Actualizar la lista de equipos
    } catch (error) {
      console.error("Error al actualizar el equipo: ", error);
      alert("Hubo un error al actualizar el equipo.");
    }
  };
  const Addcampeonato = (id)=>{
    alert(id)
  //  navigate('/equipos/equipo/'+id)
  }

const Listajugadores = (id) =>{
  alert(id)
 // navigate('/equipos/jugadores/final/'+id)
}





  return (
    <Container>
      <Row className="justify-content-center">
  {equipos.length > 0 ? (
    equipos.map((equipo) => (
      <Col xs={12} md={6} lg={4} className="mb-4" key={equipo.id}>
        <Card className="shadow">
          <Card.Body>
            <Card.Title>{equipo.nombreEquipo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Administrador: {equipo.nombreUsuario} {equipo.primerApellido} {equipo.segundoApellido}
            </Card.Subtitle>
            <Card.Text>
              <strong>Organizador:</strong> {equipo.nombre || "No disponible"}
            </Card.Text>
            <Card.Text>
              <strong>Campeonato:</strong> {equipo.nombreCampeonato || "No disponible"}
            </Card.Text>
            <Card.Text>
              <strong>ID del Equipo:</strong> {equipo.codigoEquipo}
            </Card.Text>
            <Button
              variant="warning"
              onClick={() => handleOpenUpdateModal(equipo)}
              className="me-1"
              style={{fontSize:'12px'}}
            >
              Actualizar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(equipo.id)}
              className="me-1"
              style={{fontSize:'12px'}}
            >
              Eliminar
            </Button>
            <Button  className="me-1" style={{fontSize:'12px'}} variant="primary" onClick={() => Addcampeonato(equipo.id)}>
              Campeonato
            </Button>
            <Button style={{fontSize:'12px'}} variant="primary" onClick={()=>{Listajugadores(equipo.id)}}>
             Jugadores
          </Button>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <Col>
      <p>No hay equipos registrados para este usuario.</p>
    </Col>
  )}
</Row>


      {/* Modal para actualizar equipo */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Equipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nuevo nombre del equipo"
                value={nombreEquipo}
                onChange={(e) => setNombreEquipo(e.target.value)}
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
          <Button variant="primary" onClick={()=>{Listajugadores(selectedEquipo)}}>
            ver
          </Button>
          
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Listaequipos;
