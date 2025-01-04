import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import { db } from "../../ControllerFirebase/firebase"; // Firebase config
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const Listajugadoresequipo = () => {
  const { equipoId } = useParams(); // Obtener equipoId desde la URL
  const [equipoData, setEquipoData] = useState(null);
  const [equipoJugadores, setEquipoJugadores] = useState([]);

  // Buscar equipo por ID al cargar el componente
  useEffect(() => {
    const fetchEquipoData = async () => {
      try {
        const equipoRef = doc(db, "Equipos", equipoId);
        const equipoSnapshot = await getDoc(equipoRef);

        if (equipoSnapshot.exists()) {
          setEquipoData({ id: equipoSnapshot.id, ...equipoSnapshot.data() });
          setEquipoJugadores(equipoSnapshot.data().jugadores || []);
        } else {
          alert("No se encontró un equipo con este ID.");
        }
      } catch (error) {
        console.error("Error al buscar el equipo: ", error);
      }
    };

    if (equipoId) {
      fetchEquipoData();
    }
  }, [equipoId]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow mt-4">
            <Card.Body>
              <Card.Title>Jugadores del Equipo</Card.Title>

              {equipoData ? (
                <>
                  <h5>Datos del Equipo</h5>
                  <p>
                    <strong>Nombre:</strong> {equipoData.nombreEquipo}
                  </p>
                  <p>
                    <strong>Código:</strong> {equipoData.codigoEquipo}
                  </p>
                  <hr />
                  <h5>Jugadores Asignados</h5>
                  {equipoJugadores.length > 0 ? (
                    <ListGroup>
                      {equipoJugadores.map((jugador, index) => (
                        <ListGroup.Item key={index}>
                          <strong>{jugador.nombre} {jugador.papellido} {jugador.sapellido}</strong> ({jugador.nivel})
                          <br />
                          <small>Email: {jugador.email}</small>
                          <br />
                          <small>Fecha de Nacimiento: {jugador.fechaNacimiento}</small>
                          <br />
                          <small>Tipo: {jugador.tipo}</small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>No hay jugadores asignados.</p>
                  )}
                </>
              ) : (
                <p>Cargando datos del equipo...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Listajugadoresequipo;
