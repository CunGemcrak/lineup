import React, { useState } from "react";
import { Form, Button, Card, Navbar, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { db } from "../../ControllerFirebase/firebase"; // Importa la configuración de Firebase
import { collection, addDoc } from "firebase/firestore";

const Crearcampeonato = () => {
  const [id, setId] = useState("");
  const [nombreCampeonato, setNombreCampeonato] = useState("");
  const [nivel, setNivel] = useState("Novato");
  const [fechaInicio, setFechaInicio] = useState("");

  const DATOSUSUARIO = useSelector((state) => state.USER || null);

  // Generar ID aleatorio al cargar el componente
  const generateId = () => {
    const upperCase = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");
    const lowerCase = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join("");
    const specialChars = "!@#$%^&*";
    const special = Array.from({ length: 2 }, () =>
      specialChars[Math.floor(Math.random() * specialChars.length)]
    ).join("");
    setId(upperCase + lowerCase + special);
  };

  // Guardar datos en Firestore
  const handleCrear = async () => {
    if (!id || !nombreCampeonato || !fechaInicio) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    const campeonatoData = {
      id,
      organizador: `${DATOSUSUARIO.nombre}`,
      primerApellido: DATOSUSUARIO.papellido,
      segundoApellido: DATOSUSUARIO.sapellido,
      nombreCampeonato,
      nivel,
      fechaInicio,
      idUsuario: DATOSUSUARIO.uid,
      email: DATOSUSUARIO.email,
    };

    try {
      await addDoc(collection(db, "campeonatos"), campeonatoData);
      alert("Campeonato creado exitosamente");
      // Reinicia los campos del formulario
      setId("");
      setNombreCampeonato("");
      setNivel("Novato");
      setFechaInicio("");
    } catch (error) {
      console.error("Error al guardar en Firestore: ", error);
      alert("Error al guardar el campeonato");
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4 shadow">
        <Container>
          <Navbar.Brand href="#">Crear Campeonato</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title className="mb-4">Formulario para Crear Campeonato</Card.Title>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Organizador </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese nombre y segundo nombre"
                      value={DATOSUSUARIO?.nombre || ""}
                      required
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Primer Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese primer apellido"
                      value={DATOSUSUARIO?.papellido || ""}
                      required
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Segundo Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese segundo apellido"
                      value={DATOSUSUARIO?.sapellido || ""}
                      required
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Campeonato</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese nombre del campeonato"
                      value={nombreCampeonato}
                      onChange={(e) => setNombreCampeonato(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="w-100">
                    <Form.Label>Codigo Campeonato</Form.Label>
                    <Form.Group className="w-100 d-sm-inline-flex justify-content-center text-center">
                      <Form.Control
                        type="text"
                        placeholder="Genera id"
                        style={{ width: "200px" }}
                        value={id}
                        required
                        disabled
                      />
                      <Button
                        variant="warning"
                        onClick={generateId}
                        style={{ width: "120px" }}
                      >
                        Crear ID
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nivel</Form.Label>
                    <Form.Select
                      value={nivel}
                      onChange={(e) => setNivel(e.target.value)}
                    >
                      <option>Novato</option>
                      <option>Novato Ascenso</option>
                      <option>Regular</option>
                      <option>Regular Fuerte</option>
                      <option>Fuerte</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Inicio</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={handleCrear}
                    className="w-100"
                  >
                    Crear Campeonato
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Crearcampeonato;
