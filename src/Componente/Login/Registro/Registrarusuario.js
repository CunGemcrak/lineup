import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Nav } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { crearUsuario } from '../../../Redux/actions';
import './Registro.css';
import Loading from '../../Loading/Loading';
import { useNavigate } from 'react-router';

const Registrate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const REGISTRADO = useSelector((state) => state.ACTIONUSUARIO || "No");

    const [showComponent , setShowComponent] = useState(true)
        useEffect(() => {
                // Mostrar el componente
                setShowComponent(true);
            
                // Ocultar el componente después de 2 segundos
                const timer = setTimeout(() => {
                    setShowComponent(false);
                }, 2000);
            
                // Limpiar el temporizador si el componente se desmonta
                return () => clearTimeout(timer);
            }, [dispatch]); 

  const [formData, setFormData] = useState({
    nombre: '',
    papellido: '',
    sapellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    nivel: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const validateForm = () => {
    const newErrors = {};

    // Nombre validation
    if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, ingresa un correo electrónico válido.';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales.';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    // Check if all fields are filled
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'Este campo es requerido.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e)  => {
    e.preventDefault();
    const isValid = validateForm();
    setShowComponent(true)
    if (isValid) {
     const dato = await dispatch(crearUsuario(e, formData, true));
     if(dato){
      navigate('/logueo')
     }
    } else {
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
    }
  };

  return (
    <MDBContainer className="my-5">
       {showComponent ?<Loading/>:null}
      <MDBRow className="d-flex align-items-center justify-content-center">
        <MDBCol>
          <Card className="shadow-lg card-style border-black">
            <Card.Header className="bg-black text-white text-center">
              <h4 className="textocolor">¡Únete al Club Atleticos!</h4>
            </Card.Header>
            <Card.Body className="Hotel_Body">
              <Form onSubmit={handleSubmit}>
                <div className="card-container">
                  {/* Nombre completo */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label className="d-flex form-label texto-mario">Nombre completo</Form.Label>
                        <MDBInput
                          id="register-name"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.nombre && errors.nombre && <p className="text-danger">{errors.nombre}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Primer Apellido */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label className="d-flex form-label texto-mario">Primer Apellido</Form.Label>
                        <MDBInput
                          id="register-papellido"
                          name="papellido"
                          type="text"
                          value={formData.papellido}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.papellido && errors.papellido && <p className="text-danger">{errors.papellido}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Segundo Apellido */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label className="d-flex form-label texto-mario">Segundo Apellido</Form.Label>
                        <MDBInput
                          id="register-sapellido"
                          name="sapellido"
                          type="text"
                          value={formData.sapellido}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.sapellido && errors.sapellido && <p className="text-danger">{errors.sapellido}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Correo */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label htmlFor="register-email" className="form-label texto-mario d-flex">Correo</Form.Label>
                        <MDBInput
                          id="register-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.email && errors.email && <p className="text-danger">{errors.email}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Contraseña */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label htmlFor="register-password" className="form-label texto-mario d-flex">Contraseña</Form.Label>
                        <MDBInput
                          id="register-password"
                          name="password"
                          type="password"
                          value={formData.password}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.password && errors.password && <p className="text-danger">{errors.password}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Confirmar contraseña */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label htmlFor="register-confirm-password" className="form-label texto-mario d-flex">Confirmar contraseña</Form.Label>
                        <MDBInput
                          id="register-confirm-password"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.confirmPassword && errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Fecha de nacimiento */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label className="d-flex form-label texto-mario">Fecha de Nacimiento</Form.Label>
                        <MDBInput
                          id="register-fechaNacimiento"
                          name="fechaNacimiento"
                          type="date"
                          value={formData.fechaNacimiento}
                          className="form-control-mario"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.fechaNacimiento && errors.fechaNacimiento && <p className="text-danger">{errors.fechaNacimiento}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  {/* Nivel de jugador */}
                  <MDBRow className="mb-8 d-flex w-100">
                    <MDBCol>
                      <Form.Group>
                        <Form.Label className="d-flex form-label texto-mario">Nivel de Jugador</Form.Label>
                        <Form.Control
                          as="select"
                          id="nivel"
                          name="nivel"
                          value={formData.nivel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="form-control-mario"
                        >
                          <option value="">Seleccione</option>
                          <option value="Novato">Novato</option>
                          <option value="Regular">Regular</option>
                          <option value="Fuerte">Fuerte</option>
                        </Form.Control>
                        {touched.nivel && errors.nivel && <p className="text-danger">{errors.nivel}</p>}
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>

                  <div className="text-center pt-1 mb-5 pb-1">
                    <Button
                      type="submit"
                      className="mb-4 w-70 btn-mario-login"
                    >
                      Registrarse
                    </Button>
                    <div className="mt-3">
                      <span className="texto-mario">¿Ya tienes cuenta? </span>
                      <Nav.Link href="/logueo" className="texto-mario">Inicia sesión aquí</Nav.Link>
                    </div>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Registrate;

