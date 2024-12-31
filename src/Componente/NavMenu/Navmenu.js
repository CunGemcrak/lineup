import React, { useState } from 'react';
import { Navbar, Nav, Image, Container, Dropdown } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import './Navmenu.css';

const MyNavbar = () => {
  const [showJugadoresDropdown, setShowJugadoresDropdown] = useState(false);
  const [showJuegosDropdown, setShowJuegosDropdown] = useState(false);

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
                <Dropdown.Item as={NavLink} to='/juego/partido'>Ver Juego</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <NavLink to="/logueo" className="navbar-link underline">Login</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;