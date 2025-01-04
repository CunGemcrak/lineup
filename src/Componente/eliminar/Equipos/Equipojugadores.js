import React, { useState, useEffect } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { db } from "../../../ControllerFirebase/firebase"; // Firebase config
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const Equipojugadores = () => {
  const { equipoId } = useParams(); // Obtener equipoId desde la URL
  const [equipoData, setEquipoData] = useState(null);
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState("");
  const [searchJugador, setSearchJugador] = useState("");
  const [jugadoresEncontrados, setJugadoresEncontrados] = useState([]);
  const [selectedJugador, setSelectedJugador] = useState("");
  const [jugadoresAsignados, setJugadoresAsignados] = useState([]);
  const [equipoJugadores, setEquipoJugadores] = useState([]);

  // Buscar equipo por ID al cargar el componente
  useEffect(() => {
    const buscarEquipo = async () => {
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
      buscarEquipo();
    }
  }, [equipoId]);

  // Obtener lista de campeonatos
  const fetchCampeonatos = async () => {
    try {
      const campeonatosSnapshot = await getDocs(collection(db, "campeonatos"));
      const campeonatosList = campeonatosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCampeonatos(campeonatosList);
    } catch (error) {
      console.error("Error al cargar campeonatos: ", error);
    }
  };

  useEffect(() => {
    fetchCampeonatos();
  }, []);

  // Agregar equipo al campeonato
  const agregarAlCampeonato = async () => {
    if (!selectedCampeonato) {
      alert("Por favor, seleccione un campeonato.");
      return;
    }
    try {
      const campeonatoRef = doc(db, "campeonatos", selectedCampeonato);
      const campeonatoDoc = await getDoc(campeonatoRef);

      if (!campeonatoDoc.exists()) {
        alert("No se encontró el campeonato seleccionado.");
        return;
      }

      const campeonatoData = campeonatoDoc.data();
      const equipos = campeonatoData.equipos || [];
      const codigoEquipo = equipoData.codigoEquipo;

      if (equipos.includes(codigoEquipo)) {
        alert("El equipo ya está registrado en este campeonato.");
        return;
      }

      await updateDoc(campeonatoRef, {
        equipos: [...equipos, codigoEquipo],
      });
      alert("Equipo agregado al campeonato exitosamente.");
    } catch (error) {
      console.error("Error al agregar al campeonato: ", error);
    }
  };

  // Buscar jugadores
  const buscarJugadores = async () => {
    alert(searchJugador)
    if (!searchJugador) {
      alert("Por favor, ingrese un nombre o ID de jugador.");
      return;
    }

    try {
      const q = query(
        collection(db, "usuarios"),
        where("nombre", "==", searchJugador) // También puedes buscar por ID usando otro where()
      );
      const querySnapshot = await getDocs(q);
      const jugadores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJugadoresEncontrados(jugadores);
      alert(JSON.stringify(jugadores))
    } catch (error) {
      console.error("Error al buscar jugadores: ", error);
    }
  };

  // Agregar jugador al equipo
  const agregarJugadorAlEquipo = async (jugador) => {
    try {
      const equipoRef = doc(db, "Equipos", equipoId);
      const nuevosJugadores = [...equipoJugadores, jugador];
      await updateDoc(equipoRef, {
        jugadores: nuevosJugadores,
      });
      setEquipoJugadores(nuevosJugadores);
      alert("Jugador agregado al equipo exitosamente.");
    } catch (error) {
      console.error("Error al agregar jugador al equipo: ", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow mt-4">
            <Card.Body>
              <Card.Title>Equipo y Jugadores</Card.Title>

              {equipoData ? (
                <>
                  <h5>Datos del Equipo</h5>
                  <p>
                    <strong>Nombre:</strong> {equipoData.nombreEquipo}
                  </p>
                  <p>
                    <strong>Código:</strong> {equipoData.codigoEquipo}
                  </p>
                  <p>
                    <strong>Administrador:</strong>{" "}
                    {`${equipoData.nombreUsuario} ${equipoData.primerApellido} ${equipoData.segundoApellido}`}
                  </p>

                  <Form.Group className="mb-3">
                    <Form.Label>Seleccionar Campeonato</Form.Label>
                    <Form.Select
                      value={selectedCampeonato}
                      onChange={(e) => setSelectedCampeonato(e.target.value)}
                    >
                      <option value="">Seleccione un campeonato</option>
                      {campeonatos.map((campeonato) => (
                        <option key={campeonato.id} value={campeonato.id}>
                          Campeonato {campeonato.nombreCampeonato} - Organizador:{" "}
                          {campeonato.organizador} - ID: {campeonato.id}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Button variant="success" onClick={agregarAlCampeonato}>
                    Agregar al Campeonato
                  </Button>

                  <hr />
                  <h5>Buscar Jugadores</h5>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Ingrese nombre o ID del jugador"
                      value={searchJugador}
                      onChange={(e) => setSearchJugador(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={buscarJugadores}>
                    Buscar
                  </Button>

                  {jugadoresEncontrados.length > 0 && (
                    <div className="mt-3">
                      <h6>Resultados de la búsqueda:</h6>
                      {jugadoresEncontrados.map((jugador) => (
                        <div
                          key={jugador.id}
                          className="d-flex justify-content-between align-items-center mb-2"
                        >
                          <span>
                            {jugador.nombre} {jugador.papellido} {jugador.sapellido} - ({jugador.id})
                          </span>
                          <Button
                            variant="secondary"
                            onClick={() => agregarJugadorAlEquipo(jugador)}
                          >
                            Agregar al Equipo
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <hr />
                  <h5>Jugadores Asignados</h5>
                  {equipoJugadores.length > 0 ? (
                    <ul>
                      {equipoJugadores.map((jugador, index) => (
                        <li key={index}>
                          {jugador.nombre} {jugador.papellido} {jugador.sapellido} ({jugador.id})
                        </li>
                      ))}
                    </ul>
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

export default Equipojugadores;
