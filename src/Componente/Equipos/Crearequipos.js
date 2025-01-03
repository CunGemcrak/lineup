import React, { useState } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { db } from "../../ControllerFirebase/firebase"; // Importar Firestore
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";

const Crearequipo = () => {
  const USUARIO = useSelector((state) => state.USER || null); // Obtener datos del usuario actual
  const [codigoEquipo, setCodigoEquipo] = useState("");
  const [nombreEquipo, setNombreEquipo] = useState("");

  // Generar código de equipo único
  const generarCodigoEquipo = async () => {
    const generarCodigo = () => {
      const letrasMayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const letrasMinus = "abcdefghijklmnopqrstuvwxyz";
      const numeros = "0123456789";
      const caracteres = "!@#$%^&*";
      return (
        Array(3).fill(0).map(() => letrasMayus[Math.floor(Math.random() * letrasMayus.length)]).join("") +
        Array(3).fill(0).map(() => letrasMinus[Math.floor(Math.random() * letrasMinus.length)]).join("") +
        numeros[Math.floor(Math.random() * numeros.length)] +
        caracteres[Math.floor(Math.random() * caracteres.length)]
      );
    };

    let nuevoCodigo;
    let codigoUnico = false;

    do {
      nuevoCodigo = generarCodigo();

      const q = query(collection(db, "Equipos"), where("codigoEquipo", "==", nuevoCodigo));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        codigoUnico = true;
      }
    } while (!codigoUnico);

    setCodigoEquipo(nuevoCodigo);
  };

  // Guardar equipo en Firestore
  const guardarEquipo = async () => {
    if (!nombreEquipo || !codigoEquipo) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "Equipos"), {
        uidUsuario: USUARIO.uid,
        nombreUsuario: USUARIO.nombre,
        primerApellido: USUARIO.papellido,
        segundoApellido: USUARIO.sapellido,
        codigoEquipo: codigoEquipo,
        nombreEquipo: nombreEquipo,
      });

      alert("Equipo creado exitosamente.");
      setCodigoEquipo("");
      setNombreEquipo("");
    } catch (error) {
      console.error("Error al guardar el equipo: ", error);
      alert("Hubo un error al intentar crear el equipo.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow mt-4">
            <Card.Body>
              <Card.Title>Crear Equipo</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>UID del Usuario</Form.Label>
                  <Form.Control type="text" value={USUARIO.uid} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Código ID del Equipo</Form.Label>
                  <div className="d-flex">
                    <Form.Control type="text" value={codigoEquipo} disabled className="me-2" />
                    <Button variant="primary" onClick={generarCodigoEquipo}>
                      Generar Código
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Usuario</Form.Label>
                  <Form.Control type="text" value={USUARIO.nombre} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control type="text" value={USUARIO.papellido} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control type="text" value={USUARIO.sapellido} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Equipo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre del equipo"
                    value={nombreEquipo}
                    onChange={(e) => setNombreEquipo(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="success" onClick={guardarEquipo} className="w-100">
                  Guardar Equipo
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Crearequipo;