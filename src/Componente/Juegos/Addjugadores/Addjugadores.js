import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../ControllerFirebase/firebase';

const Addjugador = () => {
  const [playerData, setPlayerData] = useState({
    average: '',
    cont: '',
    eliminado: false,
    fechaNacimiento: '',
    id: '',
    idUsuario: '',
    imagen: '',
    nivel: '',
    nombre: '',
    numeroCamisa: '',
    papellido: '',
    sapellido: '',
    tipo: '',
    equipo: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData({ ...playerData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
    if (!playerData.nombre) errors.nombre = "El nombre es requerido";
    if (!playerData.papellido) errors.papellido = "El primer apellido es requerido";
    if (!playerData.sapellido) errors.sapellido = "El segundo apellido es requerido";
    if (!playerData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es requerida";
    if (!playerData.nivel) errors.nivel = "El nivel es requerido";
    if (!playerData.tipo) errors.tipo = "El tipo de jugador es requerido";
    if (!playerData.equipo) errors.equipo = "El equipo es requerido";
    if (!playerData.average || isNaN(playerData.average)) errors.average = "El average debe ser un número válido";
    if (!playerData.cont || isNaN(playerData.cont)) errors.cont = "El cont debe ser un número válido";
    if (!playerData.numeroCamisa || isNaN(playerData.numeroCamisa)) errors.numeroCamisa = "El número de camisa debe ser un número válido";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addDoc(collection(db, "jugadoresatleticos"), playerData);
        console.log('Jugador agregado exitosamente');
        // Reiniciar el formulario después del envío
        setPlayerData({
          average: '',
          cont: '',
          eliminado: false,
          fechaNacimiento: '',
          id: '',
          idUsuario: '',
          imagen: '',
          nivel: '',
          nombre: '',
          numeroCamisa: '',
          papellido: '',
          sapellido: '',
          tipo: '',
          equipo: ''
        });
      } catch (error) {
        console.error("Error al agregar jugador: ", error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Agregar Nuevo Jugador</h2>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={playerData.nombre}
                        onChange={handleInputChange}
                        isInvalid={!!errors.nombre}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Primer Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="papellido"
                        value={playerData.papellido}
                        onChange={handleInputChange}
                        isInvalid={!!errors.papellido}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.papellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Segundo Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="sapellido"
                        value={playerData.sapellido}
                        onChange={handleInputChange}
                        isInvalid={!!errors.sapellido}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sapellido}
                      </Form.Control.Feedback>
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
                        isInvalid={!!errors.fechaNacimiento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fechaNacimiento}
                      </Form.Control.Feedback>
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
                        isInvalid={!!errors.nivel}
                      >
                        <option value="">Seleccionar nivel</option>
                        <option value="Principiante">Principiante</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                        <option value="Profesional">Profesional</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.nivel}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Jugador</Form.Label>
                      <Form.Control
                        as="select"
                        name="tipo"
                        value={playerData.tipo}
                        onChange={handleInputChange}
                        isInvalid={!!errors.tipo}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Pitcher">Pitcher</option>
                        <option value="Catcher">Catcher</option>
                        <option value="Infielder">Infielder</option>
                        <option value="Outfielder">Outfielder</option>
                        <option value="Utility">Utility</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.tipo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Equipo</Form.Label>
                      <Form.Control
                        type="text"
                        name="equipo"
                        value={playerData.equipo}
                        onChange={handleInputChange}
                        isInvalid={!!errors.equipo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.equipo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Average</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.001"
                        name="average"
                        value={playerData.average}
                        onChange={handleInputChange}
                        isInvalid={!!errors.average}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.average}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cont</Form.Label>
                      <Form.Control
                        type="number"
                        name="cont"
                        value={playerData.cont}
                        onChange={handleInputChange}
                        isInvalid={!!errors.cont}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cont}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Camisa</Form.Label>
                      <Form.Control
                        type="number"
                        name="numeroCamisa"
                        value={playerData.numeroCamisa}
                        onChange={handleInputChange}
                        isInvalid={!!errors.numeroCamisa}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numeroCamisa}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Imagen (URL)</Form.Label>
                  <Form.Control
                    type="text"
                    name="imagen"
                    value={playerData.imagen}
                    onChange={handleInputChange}
                  />
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
  );
};

export default Addjugador;
