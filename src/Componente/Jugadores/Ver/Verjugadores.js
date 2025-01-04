import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { db } from '../../../ControllerFirebase/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { lineUpAtleticos } from '../../../Redux/actions';

const Verjugadores = () => {
  const dispatch = useDispatch();
  const Juegos = useSelector((state) => state.JUEGOSACTIVOS);
  const [jugadores, setJugadores] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [allowMoreSelection, setAllowMoreSelection] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');

  const positionOptions = [
    { value: 'Pitcher', label: '1 Pitcher' },
    { value: 'Receptor', label: '2 Catcher - Receptor' },
    { value: '1Base', label: '3 Primera base' },
    { value: '2Base', label: '4 Segunda Base' },
    { value: '3Base', label: '5 Tercera Base' },
    { value: 'SS', label: '6 Short Stop' },
    { value: 'LF', label: '7 Left Field' },
    { value: 'CF', label: '8 Center Field' },
    { value: 'RF', label: '9 Right Field' },
    { value: 'Ex1', label: '10 Extra' },
    { value: 'Ex2', label: '11 Extra' },
    { value: 'Des1', label: '12 Designado' },
    { value: 'Des2', label: '13 Designado' },
  ];

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const jugadoresCollection = collection(db, 'jugadoresatleticos');
        const jugadoresSnapshot = await getDocs(jugadoresCollection);
        const jugadoresList = jugadoresSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJugadores(jugadoresList);
        setPositions(jugadoresList.map(() => ({ posicion: '' })));
      } catch (error) {
        console.error('Error al obtener jugadores desde Firestore:', error);
        alertify.error('Error al cargar los jugadores.');
      }
    };

    fetchPlayers();
  }, []);

  const handlePositionChange = (index, event) => {
    const newPositions = [...positions];
    newPositions[index].posicion = event.target.value;
    setPositions(newPositions);
  };

  const addPlayer = (jugador, index) => {
    const selectedPosition = positions[index].posicion;

    if (!selectedPosition) {
      alertify.alert('Posición no asignada', 'Debes seleccionar una posición antes de agregar un jugador.');
      return;
    }

    const isPositionTaken = selectedPlayers.some(
      (p) => positions[jugadores.findIndex((u) => u.id === p.id)].posicion === selectedPosition
    );

    if (isPositionTaken) {
      alertify.alert('Posición duplicada', 'La posición seleccionada ya está asignada a otro jugado...');
      return;
    }

    const totalSelected = selectedPlayers.length + 1;

    if (totalSelected === 9 && !allowMoreSelection) {
      alertify.confirm(
        '¿Desea agregar más jugadores?',
        () => {
          setAllowMoreSelection(true);
        },
        () => {
          setAllowMoreSelection(false);
        }
      );
    } else if (totalSelected === 13 && allowMoreSelection) {
      alertify.alert('No se pueden agregar más de 12 jugadores.');
      return;
    }

    const newPlayer = {
      id: jugador.id,
      nombre: jugador.nombre,
      papellido: jugador.papellido,
      sapellido: jugador.sapellido,
      posicion: selectedPosition,
    };

    const updatedSelectedPlayers = [...selectedPlayers, newPlayer];
    setSelectedPlayers(updatedSelectedPlayers);

    // Enviar el JSON actualizado a Redux
    dispatch(lineUpAtleticos(updatedSelectedPlayers));
  };

  const removePlayer = (jugador) => {
    const updatedSelectedPlayers = selectedPlayers.filter(
      (p) => p.id !== jugador.id
    );
    setSelectedPlayers(updatedSelectedPlayers);

    // Actualiza Redux con el nuevo JSON
    dispatch(lineUpAtleticos(updatedSelectedPlayers));

    const jugadorIndex = jugadores.findIndex((u) => u.id === jugador.id);
    const updatedPositions = [...positions];
    updatedPositions[jugadorIndex].posicion = '';
    setPositions(updatedPositions);

    if (updatedSelectedPlayers.length < 9) {
      setAllowMoreSelection(false);
    }
  };

  const getUsedPositions = () => {
    return selectedPlayers.map((p) => p.posicion);
  };

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  const createLineup = async () => {
    alert(selectedGame)
    if (!selectedGame) {
      alertify.alert('Juego no seleccionado', 'Por favor, selecciona un juego antes de crear el lineup.');
      return;
    }

    if (selectedPlayers.length < 9) {
      alertify.alert('Lineup incompleto', 'Debes seleccionar al menos 9 jugadores para crear el lineup.');
      return;
    }

    try {
      // Get the selected game details
      const gameRef = doc(db, 'juegos', selectedGame);
      const gameDoc = await getDoc(gameRef);
      
      if (!gameDoc.exists()) {
        alertify.error('El juego seleccionado no existe.');
        return;
      }

      const gameData = gameDoc.data();

      const lineupData = {
        gameId: selectedGame,
        campeonato: gameData.campeonato,
        fechaJuego: gameData.fechaJuego,
        horaJuego: gameData.horaJuego,
        players: selectedPlayers.map((player, index) => ({
          ...player,
          battingOrder: index + 1,
        })),
        createdAt: new Date(),
      };

      const lineupRef = await addDoc(collection(db, 'lineups'), lineupData);

      // Update the game document with the new lineup ID
      await updateDoc(gameRef, {
        lineupId: lineupRef.id,
      });

      alertify.success('Lineup creado y guardado exitosamente.');
      // Reset the selected players and positions
      setSelectedPlayers([]);
      setPositions(jugadores.map(() => ({ posicion: '' })));
      setAllowMoreSelection(false);
      setSelectedGame('');
    } catch (error) {
      console.error('Error al guardar el lineup:', error);
      alertify.error('Error al guardar el lineup.');
    }
  };

  return (
    <div className="CarJugadores">
      <h2 className="text-center text-white bg-dark p-3 mb-4">Lista de Jugadores</h2>
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>Seleccionar Juego</Form.Label>
            <Form.Control
              as="select"
              value={selectedGame}
              onChange={handleGameChange}
              className="border-dark"
            >
              <option value="">Selecciona un juego</option>
              {Juegos.map((juego) => (
                <option key={juego.id} value={juego.id}>
                  {juego.campeonato} - {juego.fechaJuego} - {juego.equipoLocal} VS {juego.equipoLocal}  - hora {juego.horaJuego} 
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-end">
          <Button
            variant="primary"
            className="w-100"
            onClick={createLineup}
            disabled={!selectedGame || selectedPlayers.length < 9}
          >
            Crear Lineup
          </Button>
        </Col>
      </Row>
      {jugadores.map((jugador, index) => {
        const isSelected = selectedPlayers.some((p) => p.id === jugador.id);
        const canSelectMore =
          selectedPlayers.length < 9 || (allowMoreSelection && selectedPlayers.length < 12);

        const usedPositions = getUsedPositions();

        return (
          <Card
            key={jugador.id}
            className={`m-auto border-dark w-50 mb-4 ${isSelected ? 'bg-secondary' : ''}`}
          >
            <Card.Body>
              <Row className="justify-content-center">
                <Col xs={12} md={4} className="mb-3">
                  <img
                    src={jugador.imagen}
                    alt={`${jugador.nombre} ${jugador.papellido}`}
                    className="img-fluid rounded-circle"
                    style={{ maxWidth: '150px' }}
                  />
                </Col>
                <Col xs={12} md={4} className="text-white bg-black p-3">
                  <h5>{jugador.nombre} {jugador.papellido} {jugador.sapellido}</h5>
                  <p><strong>Nivel:</strong> {jugador.nivel}</p>
                  <p><strong>Número de Camisa:</strong> {jugador.numerocamisa}</p>
                  <p><strong>Averaje:</strong> {jugador.averaje || 0}</p>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Group controlId={`posicion-${jugador.id}`} className="mb-3">
                    <Form.Label>Selecciona Posición</Form.Label>
                    <Form.Control
                      as="select"
                      value={positions[index]?.posicion || ''}
                      onChange={(e) => handlePositionChange(index, e)}
                      className="border-dark"
                      disabled={isSelected || !canSelectMore}
                    >
                      <option value="">Selecciona una posición</option>
                      {positionOptions.map((option) => (
                        <option 
                          key={option.value} 
                          value={option.value} 
                          disabled={usedPositions.includes(option.value)}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <div className="text-center">
                    {!isSelected ? (
                      <Button
                        variant="danger"
                        className="mt-4"
                        onClick={() => addPlayer(jugador, index)}
                        disabled={!canSelectMore}
                      >
                        Agregar
                      </Button>
                    ) : (
                      <Button
                        variant="dark"
                        className="mt-4"
                        onClick={() => removePlayer(jugador)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Verjugadores;

