import { Navbar, Nav, Image, Container } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import './Navmenu.css';



const MyNavbar = () => {

  return (
    <Navbar expand="lg" data-bs-theme="dark" className="navbar-elegante">
      <Container>
        {/* Imagen de la izquierda solo en pantallas grandes */}
        <Navbar.Brand to="/home" className="d-none d-lg-block">
          <Image
            src="https://res.cloudinary.com/dss2hdisa/image/upload/final_loading2_mxkyzs.gif" // Imagen de Mario Kart
            className="navbar-image bordesimg"
            width={50}
            height={50}
          />
        </Navbar.Brand>

        {/* Toggle (hamburguesa) solo en pantallas pequeñas */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none">
          <Image
            src="https://res.cloudinary.com/dss2hdisa/image/upload/final_loading2_mxkyzs.gif" // Imagen de Mario Kart
            className="navbar-image bordesimg"
            width={50}
            height={50}
          />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
           
          
          <NavLink to="/" className="navbar-link underline" >Inicio</NavLink>
            <NavLink to="/jugadores" className="navbar-link underline">Crerar Line Up</NavLink>
            <NavLink to="/listajugadores" className="navbar-link underline">Lista Jugadores</NavLink>
            <NavLink to="/juegosactivos" className="navbar-link underline">Juegos Activos</NavLink>
            <NavLink to="/partido" className="navbar-link underline">Partido</NavLink>
            <NavLink to="/logueo" className="navbar-link underline">Login</NavLink>
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
