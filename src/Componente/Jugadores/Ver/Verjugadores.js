import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { db } from '../../../ControllerFirebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { lineUpAtleticos } from '../../../Redux/actions';

const Verjugadores = () => {
  const dispatch = useDispatch();
  const [jugadores, setJugadores] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [allowMoreSelection, setAllowMoreSelection] = useState(false);

  useEffect(() => {
    const fetchPlayersFromFirestore = async () => {
      try {
        const jugadoresCollection = collection(db, 'jugadoresatleticos');
        const snapshot = await getDocs(jugadoresCollection);
        const jugadoresList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setJugadores(jugadoresList);
        setPositions(jugadoresList.map(() => ({ posicion: '' })));
      } catch (error) {
        console.error('Error al obtener jugadores desde Firestore:', error);
        alertify.error('Error al cargar los jugadores.');
      }
    };

    fetchPlayersFromFirestore();
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
      alertify.alert('Posición duplicada', 'La posición seleccionada ya está asignada a otro jugador.');
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

  return (
    <div className="CarJugadores">
      <h2 className="text-center text-white bg-dark p-3 mb-4">Lista de Jugadores</h2>
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
                      {[...Array(14)].map((_, i) => {
                        const positionValue = (i + 1).toString();
                        return (
                          <option key={i + 1} value={positionValue} disabled={usedPositions.includes(positionValue)}>
                            {positionValue}
                          </option>
                        );
                      })}
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
