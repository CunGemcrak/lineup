
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
import PerfilUsuario from './Componente/Perfil/Perfiljugadores';
import Recuperarkey from './Componente/Login/Olvidekey/Recuperarkey';
import Loading from './Componente/Loading/Loading';
import Crearcampeonato from './Componente/Campeonatos/Crearcampeonato';
import Listacampeonatos from './Componente/Campeonatos/Listacampeonatos';
import Crearequipo from './Componente/Equipos/Crearequipos';
import Listaequipos from './Componente/Equipos/Listadeequipos';
import Equipojugadores from './Componente/Equipos/Equipojugadores';

function App() {
    /*<header className="App-header">
      </header>*/
  return (
    
    <div className="App">
       <Navmenu/>
      
     <Routes>

        <Route path="/" element={<Home />} />



        {
          //perfil de usuario
        }
        <Route path="/usuario/perfil" element={<PerfilUsuario />} />
        <Route path="/jugadores/lineup" element={<Verjugadores />} />
        <Route path='/jugadores/add' element={<Addjugador/>}  />


        <Route path="/Juegos/crearprogramacion" element={<CrearProgramacion />} />



        <Route path="/juegos/juegosactivos" element={<Juegosactivos />} />
        <Route path='/juego/partido' element={<Loclvsvisitantes/>}  />


        <Route path='/jugadores/ver' element={<Listajugadores/>}  />
        
        <Route path='/logueo' element={<Logueo/>}  />
        <Route path='/registrate' element={<Registrate/>}  />
        <Route path='/usuario/recuperarkey' element={<Recuperarkey/>}  />

         {
          //!CAmpeonatos Creados
         }
        <Route path='/campeonato/crear' element={<Crearcampeonato/>} />
        <Route path='/campeonato/lista' element={<Listacampeonatos/>} />

        {
          //!equipos
        }
         <Route path='/equipos/crear' element={<Crearequipo/>} />
         <Route path='/equipos/allequipos' element={<Listaequipos/>} />
         <Route path='/equipos/equipo/:equipoId' element={<Equipojugadores/>} />
      




     </Routes>
   
      
    </div>
  );
}

export default App;
