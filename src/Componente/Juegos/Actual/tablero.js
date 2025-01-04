import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

const Tablero = () => {
  const [homeTeam, setHomeTeam] = useState('Local');
  const [awayTeam, setAwayTeam] = useState('Visitante');
  const [currentInning, setCurrentInning] = useState(1);
  const [homeRuns, setHomeRuns] = useState(0);
  const [awayRuns, setAwayRuns] = useState(0);
  const [inningScores, setInningScores] = useState([]);

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

  const buttonStyle = {
    transition: 'all 0.3s',
  };

  const hoverStyle = {
    transform: 'scale(1.1)',
  };

  return (
    <Container className="p-3 border rounded shadow-sm bg-gradient-light-to-dark" style={{ maxWidth: '400px' }}>
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
    </Container>
  );
};

export default Tablero;

