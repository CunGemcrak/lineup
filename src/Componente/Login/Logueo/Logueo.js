import React, { useState } from 'react';
import { Button, Card, Nav } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import './Login.css';

import { accesoUsuario } from '../../../Redux/actions'; 
import { useDispatch } from 'react-redux';


const Logueo = () => {
  const dispatch = useDispatch()


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { email, password } = formData;
    dispatch(accesoUsuario(email, password))
    
    // Validación simple
    if (!email || !password) {
      setErrors({ email: 'Por favor ingresa tu correo electrónico', password: 'Por favor ingresa tu contraseña' });
      return;
    }

    // Si todo está bien, procesar el login
   // dispatch({ type: 'LOGIN', payload: formData });

    // Redirigir (si es necesario)
  //  navigate('/dashboard');
  };

  return (
    <MDBContainer className="my-5">
      <MDBRow className="align-items-center justify-content-center">
        {/* Columna izquierda: Formulario de Login */}
        <MDBCol>
          <Card className="shadow-lg card-style border-black">
            <Card.Header className="bg-black text-white text-center">
              <h4 className="textocolor">¡Inicia sesión en Atleticos Club!</h4>
            </Card.Header>
            <Card.Body className="Hotel_Body">
              <div className="card-container">
                {/* Fila para los inputs */}
                <MDBRow className="mb-4 w-100">
                  <MDBCol>
                    <div htmlFor="login-email" className="d-flex form-label texto-mario">Correo Electrónico</div>
                    <MDBInput
                      id="login-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      className="form-control-mario"
                      onChange={handleChange}
                    />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-4 w-100">
                  <MDBCol>
                    <div htmlFor="login-password" className="d-flex form-label texto-mario w-100">Contraseña</div>
                    <MDBInput
                      id="login-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      className="form-control-mario"
                      onChange={handleChange}
                    />
                    {errors.password && <p className="text-danger">{errors.password}</p>}
                  </MDBCol>
                </MDBRow>

                <div className="text-center pt-1 mb-5 pb-1">
                  <Button
                    className="mb-4 btn-mario-login w-70"
                    onClick={handleSubmit}
                  >
                    Iniciar sesión
                  </Button>

                  <div className="mt-3">
                    <Nav.Link href="/rkey" className="texto-mario">¿Olvidaste tu contraseña?</Nav.Link>
                  </div>

                  <div className="mt-3">
                    <span className="texto-mario">¿No tienes cuenta? </span>
                    <Nav.Link href="/registrate" className="texto-mario">Regístrate aquí</Nav.Link>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </MDBCol>

        {/* Columna derecha: Imagen y texto de bienvenida */}
        <MDBCol lg="6" md="12" className="text-center d-none d-md-block">
          <img
            src="https://res.cloudinary.com/dss2hdisa/image/upload/final_loading2_mxkyzs.gif"
            style={{ width: '80%', borderRadius: '10%' }}
            alt="Reino Champiñón"
          />
          <h4 className="mt-2 mb-2 pb-1">¡Bienvenido al Hotel Champiñón!</h4>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Logueo;
