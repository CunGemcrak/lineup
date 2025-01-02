import React, { useEffect, useState } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { Navbar, Nav, Image, Container, Dropdown } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import './Navmenu.css';
import { useDispatch, useSelector } from 'react-redux';


import {cerrarLogeo} from '../../Redux/actions';
import Loading from '../Loading/Loading';

const MyNavbar = () => {
  const ESTADOUSER = useSelector((state)=>state.USER || null)
  const navigate = useNavigate()
  const location = useLocation(); // Obtener la ruta actual
  const dispatch = useDispatch()
  const [showJugadoresDropdown, setShowJugadoresDropdown] = useState(false);
  const [showJuegosDropdown, setShowJuegosDropdown] = useState(false);
  const [showEquioposDropdown, setShowEquioposDropdown] = useState(false);
  const [showCampeonatoDropdown, setShowCampeonatosDropdown] = useState(false);



  const [menuActivo, setMenuActivo] = useState(false)

  // Solo se ejecuta una vez al cargar el componente

 /* useEffect(() => {
    const allowedRoutes = ['/registrate', '/recuperarkey', '/usuario/recuperarkey'];
    if (ESTADOUSER === null && !allowedRoutes.includes(location.pathname)) {
      setMenuActivo(false);
      navigate('/logueo'); // Redirigir al logueo si no está autorizado
    } else if (ESTADOUSER === null) {
      setMenuActivo(false);
    } 
  }, [ESTADOUSER, location.pathname, navigate]);

*/



const handleSalir = () => {
  // Mostrar cuadro de confirmación con Alertify
  alertify.confirm('Confirmación','¿Seguro que quieres salir?',
      function () {
        alertify.success('Te esperamos pronto'); // Mensaje de despedida
        dispatch(cerrarLogeo()); // Cerrar sesión
        navigate('/'); // Redirigir al inicio
      },
      // Función a ejecutar si el usuario cancela (botón "No")
      function () {
        alertify.error('Acción cancelada'); // Mensaje de cancelación
      }
    )
    // Personalizar los textos de los botones
    .set('labels', { ok: 'Sí', cancel: 'No' });
  };
  
  return (
    <Navbar expand="lg" data-bs-theme="dark" className="navbar-elegante">
     
      <Container>

        <Navbar.Brand as={NavLink} to="/home" className="d-none d-lg-block">
          <Image
            src="https://res.cloudinary.com/dss2hdisa/image/upload/final_loading2_mxkyzs.gif"
            className="navbar-image bordesimg"
            width={50}
            height={50}
            alt="Logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none">
          <Image
            src="https://res.cloudinary.com/dss2hdisa/image/upload/final_loading2_mxkyzs.gif"
            className="navbar-image bordesimg"
            width={50}
            height={50}
            alt="Menu"
          />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink to="/" className="navbar-link underline">Inicio</NavLink>
            
            <Dropdown
              show={showJugadoresDropdown}
              onMouseEnter={() => setShowJugadoresDropdown(true)}
              onMouseLeave={() => setShowJugadoresDropdown(false)}
            >
              <Dropdown.Toggle as={Nav.Link} className="navbar-link underline">
                Jugadores
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to='/jugadores/add'>Agregar Jugador</Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/jugadores/ver">Ver Lista</Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/jugadores/lineup">Line Up</Dropdown.Item>
                
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              show={showJuegosDropdown}
              onMouseEnter={() => setShowJuegosDropdown(true)}
              onMouseLeave={() => setShowJuegosDropdown(false)}
            >
              <Dropdown.Toggle as={Nav.Link} className="navbar-link underline">
                Juegos
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/Juegos/crearprogramacion">Crear Juego</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/juegos/juegosactivos">Listado de Juegos</Dropdown.Item>
                <Dropdown.Item as={NavLink} to='/juego/partido'>Seguir Juego</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>





            <Dropdown
              show={showEquioposDropdown}
              onMouseEnter={() => setShowEquioposDropdown(true)}
              onMouseLeave={() => setShowEquioposDropdown(false)}
            >
              <Dropdown.Toggle as={Nav.Link} className="navbar-link underline">
                Equipos
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/Equipo/crear">Crear Equipo</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/Equipo/ver">Ver Equipoos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>



            <Dropdown
              show={showCampeonatoDropdown}
              onMouseEnter={() => setShowCampeonatosDropdown(true)}
              onMouseLeave={() => setShowCampeonatosDropdown(false)}
            >
              <Dropdown.Toggle as={Nav.Link} className="navbar-link underline">
                Camponatos
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/campeonato/crear">Crear Campeonato</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/campeonato/lista">Lista Campeonatos</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/Equipo/Programacion">Programacion Campeonatos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>










            <NavLink to="/usuario/perfil" className="navbar-link underline">Perfil</NavLink> 

            <NavLink to="/logueo" className="navbar-link underline">Login</NavLink> 
             <NavLink to="#" className="navbar-link underline" onClick={handleSalir }>Salir</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;