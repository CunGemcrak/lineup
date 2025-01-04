import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { db } from '../../../ControllerFirebase/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { useNavigate } from 'react-router';

const Loclvsvisitantes = () => {
  // State variables from Tablero
  const [homeTeam, setHomeTeam] = useState('Local');
  const [awayTeam, setAwayTeam] = useState('Visitante');
  const [currentInning, setCurrentInning] = useState(1);
  const [homeRuns, setHomeRuns] = useState(0);
  const [awayRuns, setAwayRuns] = useState(0);
  const [inningScores, setInningScores] = useState([]);

  // State variables from Loclvsvisitantes
  const [lineups, setLineups] = useState([]);
  const [selectedLineup, setSelectedLineup] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [turnoActual, setTurnoActual] = useState(0);
  const [actions, setActions] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [editedBattingOrder, setEditedBattingOrder] = useState(null);
  const [editedActions, setEditedActions] = useState('');
  const [turnosAlBat, setTurnosAlBat] = useState({});
  const [idLineupEliminar, setidLineupEliminar] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
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

  // Functions from Tablero
  const advanceInning = () => {
    setInningScores([...inningScores, { home: homeRuns, away: awayRuns }]);
    setCurrentInning(currentInning + 1);
    setHomeRuns(0);
    setAwayRuns(0);
  };

  const updateRuns = (team, increment) => {
    if (team === 'home') {
      setHomeRuns(Math.max(0, homeRuns + increment));
    } else {
      setAwayRuns(Math.max(0, awayRuns + increment));
    }
  };

  // Functions from Loclvsvisitantes
  /*const handleSelectLineup = (lineupId) => {
    const lineup = lineups.find(l => l.id === lineupId);
    if (lineup) {
      setSelectedLineup(lineup);
      setJugadores(lineup.players || []);
      setActions(lineup.actions || {});
      setTurnosAlBat(lineup.TurnosAlBat || {});
      setHomeTeam(lineup.equipo1);
      setAwayTeam(lineup.equipo2);
    }
  };*/
  const handleSelectLineup = (lineupId) => {
    if (!lineups || lineups.length === 0) {
      console.error('La lista de lineups está vacía o no está cargada.');
      return;
    }
    const lineup = lineups.find(l => String(l.id) === String(lineupId));
    if (lineup) {
      setidLineupEliminar(lineup.id)
      setSelectedLineup(lineup);
      setJugadores(lineup.players || []);
      setActions(lineup.actions || {});
      setTurnosAlBat(lineup.TurnosAlBat || {});
      setHomeTeam(lineup.equipo1 || 'Equipo Local');
      setAwayTeam(lineup.equipo2 || 'Equipo Visitante');
    } else {
      console.error(`No se encontró el lineup con ID ${lineupId}.`);
    }
  };
  



  const handleNextTurn = () => {
    setTurnoActual((prevTurno) => (prevTurno + 1) % jugadores.length);
  };

  const handleAction = (action) => {
    const currentPlayer = jugadores[turnoActual];
    const playerKey = `${currentPlayer.nombre}-${currentPlayer.apellido}`;
    const updatedActions = {
      ...actions,
      [playerKey]: actions[playerKey] ? `${actions[playerKey]}, ${action}` : action,
    };
    
    const updatedTurnosAlBat = {
      ...turnosAlBat,
      [playerKey]: [
        ...(turnosAlBat[playerKey] || []),
        {
          turno: turnosAlBat[playerKey] ? turnosAlBat[playerKey].length + 1 : 1,
          accion: action,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setActions(updatedActions);
    setTurnosAlBat(updatedTurnosAlBat);
    updateFirestore(updatedActions, null, updatedTurnosAlBat);
    handleNextTurn();

    // Update runs based on the action
    if (action === 'H' || action === '2B' || action === '3B' || action === 'HR') {
      updateRuns('home', 1);
    }
  };

  const handleEdit = (index, playerKey) => {
    setEditMode(index);
    setEditedBattingOrder(jugadores[index].battingOrder);
    setEditedActions(actions[playerKey] || '');
  };

  const handleSaveEdit = async (index, playerKey) => {
    const updatedPlayers = [...jugadores];
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      battingOrder: editedBattingOrder
    };

    updatedPlayers.sort((a, b) => a.battingOrder - b.battingOrder);

    const updatedActions = {
      ...actions,
      [playerKey]: editedActions
    };

    setJugadores(updatedPlayers);
    setActions(updatedActions);
    setEditMode(null);

    await updateFirestore(updatedActions, updatedPlayers);
  };

  const updateFirestore = async (updatedActions, updatedPlayers = null, updatedTurnosAlBat = null) => {
    if (selectedLineup) {
      const lineupRef = doc(db, 'lineups', selectedLineup.id);
      try {
        const updateData = { 
          actions: updatedActions,
          TurnosAlBat: updatedTurnosAlBat || turnosAlBat,
          inningScores: inningScores,
          currentInning: currentInning,
          homeRuns: homeRuns,
          awayRuns: awayRuns
        };
        if (updatedPlayers) {
          updateData.players = updatedPlayers;
        }
        await updateDoc(lineupRef, updateData);
        console.log('Lineup actualizado en Firestore');
      } catch (error) {
        console.error('Error al actualizar el lineup en Firestore:', error);
      }
    }
  };


  const hableFinalizarJuego = () => {
    alertify.confirm(
      'Confirmación',
      '¿Seguro que quieres finalizar el juego?',
      async () => {
        if (selectedLineup) {
          alert(idLineupEliminar)
          const lineupRef = doc(db, 'lineups', selectedLineup.id);
          const gameRef = doc(db, 'juegos', idLineupEliminar);

          try {
            // Actualizar estado en Firestore
            await updateDoc(lineupRef, { juego: 'Finalizado' });
            await updateDoc(gameRef, { estado: 'Finalizado' });
            navigate("/jugadores/lineup")
            alertify.success('El juego ha sido finalizado correctamente');
          } catch (error) {
            alertify.error('Error al finalizar el juego');
            console.error('Error al finalizar el juego:', error);
          }
        }
      },
      () => {
        alertify.message('Cancelado');
      }
    );
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h2 className="h4 mb-3">Tablero de Béisbol</h2>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Visitante"
                size="sm"
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Local"
                size="sm"
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col>
              <strong>Entrada: {currentInning}</strong>
            </Col>
            <Col className="text-end">
              <Button
                variant="primary"
                size="sm"
                onClick={advanceInning}
                className="bg-gradient-primary-to-secondary fw-bold animate__animated animate__pulse animate__infinite"
              >
                Siguiente
              </Button>
              <br/>
              <Button
                variant="danger"
                size="sm"
                onClick={hableFinalizarJuego}
                className="mt-2 bg-gradient-primary-to-secondary fw-bold animate__animated animate__pulse animate__infinite"
              >
                End Game
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="text-center">
              <div className="fw-bold mb-2">{awayTeam}</div>
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => updateRuns('away', -1)}
                  className="fw-bold animate__animated animate__headShake"
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  value={awayRuns}
                  readOnly
                  className="mx-2"
                  style={{ width: '50px' }}
                  size="sm"
                />
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => updateRuns('away', 1)}
                  className="fw-bold animate__animated animate__headShake"
                >
                  +
                </Button>
              </div>
            </Col>
            <Col className="text-center">
              <div className="fw-bold mb-2">{homeTeam}</div>
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => updateRuns('home', -1)}
                  className="fw-bold animate__animated animate__headShake"
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  value={homeRuns}
                  readOnly
                  className="mx-2"
                  style={{ width: '50px' }}
                  size="sm"
                />
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => updateRuns('home', 1)}
                  className="fw-bold animate__animated animate__headShake"
                >
                  +
                </Button>
              </div>
            </Col>
          </Row>
          <Table bordered size="sm" className="text-center">
            <thead>
              <tr>
                <th>Equipo</th>
                {inningScores.map((_, index) => (
                  <th key={index}>{index + 1}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{awayTeam}</td>
                {inningScores.map((score, index) => (
                  <td key={index}>{score.away}</td>
                ))}
                <td className="fw-bold">
                  {inningScores.reduce((sum, score) => sum + score.away, 0)}
                </td>
              </tr>
              <tr>
                <td>{homeTeam}</td>
                {inningScores.map((score, index) => (
                  <td key={index}>{score.home}</td>
                ))}
                <td className="fw-bold">
                  {inningScores.reduce((sum, score) => sum + score.home, 0)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <div className="mb-4">
            <label htmlFor="lineupSelect">Selecciona un Lineup Activo:</label>
            <select
              id="lineupSelect"
              className="form-select"
              onChange={(e) => handleSelectLineup(e.target.value)}
            >
              <option value="">Seleccione un Lineup</option>
              {/*lineups.map(lineup => (
                <option key={lineup.id} value={lineup.id}>
                  {lineup.equipo1} VS {lineup.equipo2}
                </option>
              ))*/}

{lineups.map((lineup) => (
  <option key={lineup.id} value={lineup.id}>
     {lineup.equipo1} VS {lineup.equipo2}
  </option>
))}

            </select>
          </div>

          {selectedLineup && (
            <div className="mt-3">
              <h3>{homeTeam}</h3>
              <ol className="list-group">
                {jugadores
                  .sort((a, b) => a.battingOrder - b.battingOrder)
                  .map((player, index) => {
                    const playerKey = `${player.nombre}-${player.apellido}`;
                    return (
                      <li key={index} className={`list-group-item d-flex justify-content-between align-items-center w-100 mx-auto ${index === turnoActual ? 'bg-warning' : ''}`}>
                        <span>
                          {editMode === index ? (
                            <>
                              <input
                                type="number"
                                value={editedBattingOrder}
                                onChange={(e) => setEditedBattingOrder(Number(e.target.value))}
                                className="form-control d-inline-block w-auto mr-2"
                              />
                              <input
                                type="text"
                                value={editedActions}
                                onChange={(e) => setEditedActions(e.target.value)}
                                className="form-control d-inline-block w-auto mr-2"
                              />
                              <button
                                onClick={() => handleSaveEdit(index, playerKey)}
                                className="btn btn-success btn-sm"
                              >
                                Guardar
                              </button>
                            </>
                          ) : (
                            <>
                              {player.battingOrder}.
                              <input
                                type="text"
                                value={`${player.nombre} ${player.apellido}`}
                                readOnly
                                className="form-control-plaintext d-inline-block w-auto ml-2"
                              />
                              <button
                                onClick={() => handleEdit(index, playerKey)}
                                className="btn btn-primary btn-sm ml-2"
                              >
                                Editar
                              </button>
                            </>
                          )}
                        </span>
                        <span>{actions[playerKey] || ''}</span>
                        {index === turnoActual && (
                          <div>
                            {['H', 'BB', '2B', '3B', 'FO', 'K', 'KB', 'BE', 'HR', '4B'].map((action) => (
                              <button
                                key={action}
                                onClick={() => handleAction(action)}
                                className="btn btn-secondary m-1"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ol>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Loclvsvisitantes;

