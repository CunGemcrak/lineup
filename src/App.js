
import './App.css';
import { Route, Routes } from 'react-router';
import Verjugadores from './Componente/Jugadores/Ver/Verjugadores';
import Navmenu from './Componente/NavMenu/Navmenu';
import Home from './Componente/home/Home';
import Juegosactivos from './Componente/Juegos/Listadojuegos/Juegosactivos';
import Listajugadores from './Componente/Jugadores/Listajugadores/Listajugadores';
import Loclvsvisitantes from './Componente/Juegos/Actual/Localvsviocitante';
import Logueo from './Componente/Login/Logueo/Logueo';
import Registrate from './Componente/Login/Registro/Registrarusuario';
import Addjugador from './Componente/Juegos/Addjugadores/Addjugadores';
import CrearProgramacion from './Componente/Juegos/Crearprogramacion/Crearprogramacion';

function App() {
    /*<header className="App-header">
      </header>*/
  return (
    
    <div className="App">
       <Navmenu/>
     <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/jugadores/lineup" element={<Verjugadores />} />
        <Route path='/jugadores/add' element={<Addjugador/>}  />


        <Route path="/Juegos/crearprogramacion" element={<CrearProgramacion />} />



        <Route path="/juegos/juegosactivos" element={<Juegosactivos />} />
        <Route path='/juego/partido' element={<Loclvsvisitantes/>}  />


        <Route path='/jugadores/ver' element={<Listajugadores/>}  />
        
        <Route path='/logueo' element={<Logueo/>}  />
        <Route path='/registrate' element={<Registrate/>}  />

      




     </Routes>
   
      
    </div>
  );
}

export default App;
