import React, { useEffect, useState, useNavigate } from 'react';
import { Form, Button, Card, Nav } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import './Registro.css'; 
//import alertify from 'alertifyjs';
import { useDispatch, useSelector } from 'react-redux';
import { crearUsuario } from '../../../Redux/actions'

const Registrate = () => {
  //const navigate = useNavigate();
  const dispatch = useDispatch()
  const REGISTRADO = useSelector((state)=>state.ACTIONUSUARIO || "No")

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

  const [errors, setErrors] = useState({
    nombre: '',
    papellido: '',
    sapellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    nivel: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Validación de campos
  const validateName = (name) => {
    if (name.length < 3) {
      setErrors((prev) => ({ ...prev, nombre: 'El nombre debe tener al menos 3 caracteres.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, nombre: '' }));
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Por favor, ingresa un correo electrónico válido.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({ ...prev, password: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: '' }));
    return true;
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (confirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  const checkFormValidity = () => {
    const isValid = Object.values(errors).every((error) => error === '') &&
                    Object.values(formData).every((field) => field !== '');
    setIsFormValid(isValid);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;

    if (id === 'register-name') validateName(value);
    if (id === 'register-papellido') validateName(value);
    if (id === 'register-sapellido') validateName(value);
    if (id === 'register-email') validateEmail(value);
    if (id === 'register-password') validatePassword(value);
    if (id === 'register-confirm-password') validateConfirmPassword(value, formData.password);
  };

  useEffect(() => {
    checkFormValidity();
  }, [errors, formData, checkFormValidity]); // Añadir checkFormValidity como dependencia

  const handleSubmit = async (e) => {
    dispatch(crearUsuario(e, formData, isFormValid))
  };
  return (
    <MDBContainer className="my-5">
      <MDBRow className="d-flex align-items-center justify-content-center">
        <MDBCol>
          <Card className="shadow-lg card-style border-black">
            <Card.Header className="bg-black text-white text-center">
              <h4 className="textocolor">¡Únete al Club Atleticos!</h4>
            </Card.Header>
            <Card.Body className="Hotel_Body">
              <div className="card-container">
                {/* Nombre completo */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <div className="d-flex form-label texto-mario">Nombre completo</div>
                    <MDBInput
                      id="register-name"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.nombre && <p className="text-danger">{errors.nombre}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Primer Apellido */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <div className="d-flex form-label texto-mario">Primer Apellido</div>
                    <MDBInput
                      id="register-papellido"
                      name="papellido"
                      type="text"
                      value={formData.papellido}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.papellido && <p className="text-danger">{errors.papellido}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Segundo Apellido */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <div className="d-flex form-label texto-mario">Segundo Apellido</div>
                    <MDBInput
                      id="register-sapellido"
                      name="sapellido"
                      type="text"
                      value={formData.sapellido}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.sapellido && <p className="text-danger">{errors.sapellido}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Correo */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <label htmlFor="register-email" className="form-label texto-mario d-flex ">Correo</label>
                    <MDBInput
                      id="register-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Contraseña */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <label htmlFor="register-password" className="form-label texto-mario d-flex ">Contraseña</label>
                    <MDBInput
                      id="register-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Confirmar contraseña */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <label htmlFor="register-confirm-password" className="form-label texto-mario d-flex ">Confirmar contraseña</label>
                    <MDBInput
                      id="register-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Fecha de nacimiento */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <div className="d-flex form-label texto-mario">Fecha de Nacimiento</div>
                    <MDBInput
                      id="register-fechaNacimiento"
                      name="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      className="form-control-mario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.fechaNacimiento && <p className="text-danger">{errors.fechaNacimiento}</p>}
                  </MDBCol>
                </MDBRow>

                {/* Nivel de jugador */}
                <MDBRow className="mb-8 d-flex w-100">
                  <MDBCol>
                    <div className="d-flex form-label texto-mario">Nivel de Jugador</div>
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
                    {errors.nivel && <p className="text-danger">{errors.nivel}</p>}
                  </MDBCol>
                </MDBRow>

                <div className="text-center pt-1 mb-5 pb-1">
                  <Button
                    className="mb-4 w-70 btn-mario-login"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                  >
                    Registrarse
                  </Button>
                  <div className="mt-3">
                    <span className="texto-mario">¿Ya tienes cuenta? </span>
                    <Nav.Link href="/logueo" className="texto-mario">Inicia sesión aquí</Nav.Link>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Registrate;
