import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../../ControllerFirebase/firebase'; // Configuración de Firebase
import { collection, getDocs, query, where } from 'firebase/firestore';

const Loclvsvisitantes = () => {
  const [lineups, setLineups] = useState([]);
  const [selectedLineup, setSelectedLineup] = useState(null);
  const [locales, setLocales] = useState([]);
  const [visitantes, setVisitantes] = useState([]);
  const [selectedTab, setSelectedTab] = useState('visitante');
  const [turnoVisitante, setTurnoVisitante] = useState(0);
  const [turnoLocal, setTurnoLocal] = useState(0);
  const [actions, setActions] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [carrerasVisitante, setCarrerasVisitante] = useState(0);
  const [carrerasLocal, setCarrerasLocal] = useState(0);

  useEffect(() => {
    // Cargar lineups con estado "Activo"
    const fetchLineups = async () => {
      try {
        const lineupsRef = collection(db, 'lineups');
        const q = query(lineupsRef, where('juego', '==', 'Activo'));
        const snapshot = await getDocs(q);
        const lineupsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLineups(lineupsData);
      } catch (error) {
        console.error('Error al cargar los lineups:', error);
      }
    };

    fetchLineups();
  }, []);

  const handleSelectLineup = (lineupId) => {
    const lineup = lineups.find(l => l.id === lineupId);
    if (lineup) {
      setSelectedLineup(lineup);
      setLocales(lineup.players || []);
      setVisitantes(lineup.players || []);
    }
  };

  const handleNextTurn = (equipo) => {
    if (equipo === 'visitante') {
      setTurnoVisitante((prevTurno) => (prevTurno + 1) % visitantes.length);
    } else if (equipo === 'local') {
      setTurnoLocal((prevTurno) => (prevTurno + 1) % locales.length);
    }
  };

  const handleAction = (equipo, action) => {
    const currentPlayer =
      equipo === 'visitante' ? visitantes[turnoVisitante] : locales[turnoLocal];
    const playerKey = `${currentPlayer.nombre}-${currentPlayer.apellido}`;
    setActions({
      ...actions,
      [playerKey]: actions[playerKey] ? `${actions[playerKey]}, ${action}` : action,
    });
  };

  const handleEdit = (equipo) => {
    const currentPlayer =
      equipo === 'visitante' ? visitantes[turnoVisitante] : locales[turnoLocal];
    const playerKey = `${currentPlayer.nombre}-${currentPlayer.apellido}`;
    setEditMode(playerKey);
  };

  const handleUpdate = () => {
    setEditMode(null);
  };

  const handleCarreras = (equipo, operation) => {
    if (equipo === 'visitante') {
      setCarrerasVisitante((prev) =>
        operation === 'increment' ? prev + 1 : Math.max(prev - 1, 0)
      );
    } else {
      setCarrerasLocal((prev) =>
        operation === 'increment' ? prev + 1 : Math.max(prev - 1, 0)
      );
    }
  };

  return (
    <div className="container mt-5">
      {/* Selector de lineup */}
      <div className="mb-4">
        <label htmlFor="lineupSelect">Selecciona un Lineup Activo:</label>
        <select
          id="lineupSelect"
          className="form-select"
          onChange={(e) => handleSelectLineup(e.target.value)}
        >
          <option value="">Seleccione un Lineup</option>
          {lineups.map(lineup => (
            <option key={lineup.id} value={lineup.id}>
              {lineup.equipo1} VS {lineup.equipo2}
            </option>
          ))}
        </select>
      </div>

      {/* Verifica si se ha seleccionado un lineup */}
      {selectedLineup ? (
        <>
          {/* Menú de navegación */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${selectedTab === 'visitante' ? 'active' : ''}`}
                onClick={() => setSelectedTab('visitante')}
                style={{ cursor: 'pointer' }}
              >
                Visitante
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${selectedTab === 'local' ? 'active' : ''}`}
                onClick={() => setSelectedTab('local')}
                style={{ cursor: 'pointer' }}
              >
                Local
              </a>
            </li>
          </ul>

          {/* Contenido de las pestañas */}
          <div className="tab-content mt-3">
            {selectedTab === 'visitante' && (
              <div>
                <h3>
                  Equipo Visitante - Carreras anotadas
                  <button
                    onClick={() => handleCarreras('visitante', 'decrement')}
                    className="btn btn-danger btn-sm ml-3"
                  >
                    -
                  </button>
                  <span className="ml-2">{carrerasVisitante}</span>
                  <button
                    onClick={() => handleCarreras('visitante', 'increment')}
                    className="btn btn-success btn-sm ml-2"
                  >
                    +
                  </button>
                </h3>
                <ol className="list-group">
                  {visitantes
                    .sort((a, b) => a.battingOrder - b.battingOrder)
                    .map((player, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{player.battingOrder}. {player.nombre} {player.apellido}</span>
                      <span>{actions[`${player.nombre}-${player.apellido}`] || ''}</span>
                    </li>
                  ))}
                </ol>
                <button
                  onClick={() => handleNextTurn('visitante')}
                  className="btn btn-primary mt-3"
                >
                  Siguiente Turno Visitante
                </button>
              </div>
            )}

            {selectedTab === 'local' && (
              <div>
                <h3>
                  Equipo Local - Carreras anotadas
                  <button
                    onClick={() => handleCarreras('local', 'decrement')}
                    className="btn btn-danger btn-sm ml-3"
                  >
                    -
                  </button>
                  <span className="ml-2">{carrerasLocal}</span>
                  <button
                    onClick={() => handleCarreras('local', 'increment')}
                    className="btn btn-success btn-sm ml-2"
                  >
                    +
                  </button>
                </h3>
                <ol className="list-group">
                  {locales
                    .sort((a, b) => a.battingOrder - b.battingOrder)
                    .map((player, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{player.battingOrder}. {player.nombre} {player.apellido}</span>
                      <span>{actions[`${player.nombre}-${player.apellido}`] || ''}</span>
                    </li>
                  ))}
                </ol>
                <button
                  onClick={() => handleNextTurn('local')}
                  className="btn btn-primary mt-3"
                >
                  Siguiente Turno Local
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="alert alert-warning mt-3">No hay juego seleccionado</p>
      )}
    </div>
  );
};

export default Loclvsvisitantes;

