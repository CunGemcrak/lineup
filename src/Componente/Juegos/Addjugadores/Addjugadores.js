import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Addjugador = () => {
  const [playerData, setPlayerData] = useState({
    email: '',
    fechaNacimiento: '',
    nivel: '',
    nombre: '',
    papellido: '',
    sapellido: '',
    tipo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData({ ...playerData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí normalmente enviarías los datos al backend o sistema de gestión de estado
    console.log('Datos del jugador enviados:', playerData);
    // Reiniciar el formulario después del envío
    setPlayerData({
      email: '',
      fechaNacimiento: '',
      nivel: '',
      nombre: '',
      papellido: '',
      sapellido: '',
      tipo: ''
    });
  };

  return (
    <>
     
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Agregar Nuevo Jugador</h2>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={playerData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Primer Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          name="papellido"
                          value={playerData.papellido}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Segundo Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          name="sapellido"
                          value={playerData.sapellido}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={playerData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaNacimiento"
                          value={playerData.fechaNacimiento}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nivel</Form.Label>
                        <Form.Control
                          as="select"
                          name="nivel"
                          value={playerData.nivel}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccionar nivel</option>
                          <option value="Principiante">Principiante</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Avanzado">Avanzado</option>
                          <option value="Profesional">Profesional</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                      as="select"
                      name="tipo"
                      value={playerData.tipo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Pitcher">Pitcher</option>
                      <option value="Catcher">Catcher</option>
                      <option value="Infielder">Infielder</option>
                      <option value="Outfielder">Outfielder</option>
                      <option value="Utility">Utility</option>
                    </Form.Control>
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="primary" type="submit" size="lg">
                      Agregar Jugador
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Addjugador;