import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { usuarios } from '../../../bdJugadores';

// Limitar a 12 jugadores
const visitantes = usuarios.slice(0, 12);
const locales = usuarios.slice(0, 12);

const Loclvsvisitantes = () => {
    const [selectedTab, setSelectedTab] = useState('visitante');
    const [turnoVisitante, setTurnoVisitante] = useState(0);
    const [turnoLocal, setTurnoLocal] = useState(0);
    const [actions, setActions] = useState({});
    const [editMode, setEditMode] = useState(null);
    const [carrerasVisitante, setCarrerasVisitante] = useState(0);
    const [carrerasLocal, setCarrerasLocal] = useState(0);

    const handleNextTurn = (equipo) => {
        if (equipo === 'visitante') {
            setTurnoVisitante((prevTurno) => (prevTurno + 1) % visitantes.length);
        } else if (equipo === 'local') {
            setTurnoLocal((prevTurno) => (prevTurno + 1) % locales.length);
        }
    };

    const handleAction = (equipo, action) => {
        const currentPlayer = equipo === 'visitante' ? visitantes[turnoVisitante] : locales[turnoLocal];
        const playerKey = `${currentPlayer.nombre}-${currentPlayer.apellido}`;
        
        setActions({
            ...actions,
            [playerKey]: actions[playerKey] ? `${actions[playerKey]}, ${action}` : action
        });
    };

    const handleEdit = (equipo) => {
        const currentPlayer = equipo === 'visitante' ? visitantes[turnoVisitante] : locales[turnoLocal];
        const playerKey = `${currentPlayer.nombre}-${currentPlayer.apellido}`;
        setEditMode(playerKey);
    };

    const handleUpdate = () => {
        setEditMode(null);
    };

    const handleCarreras = (equipo, operation) => {
        if (equipo === 'visitante') {
            setCarrerasVisitante((prevCarreras) => {
                if (operation === 'increment') {
                    return prevCarreras + 1;
                } else if (operation === 'decrement' && prevCarreras > 0) {
                    return prevCarreras - 1;
                }
                return prevCarreras;
            });
        } else if (equipo === 'local') {
            setCarrerasLocal((prevCarreras) => {
                if (operation === 'increment') {
                    return prevCarreras + 1;
                } else if (operation === 'decrement' && prevCarreras > 0) {
                    return prevCarreras - 1;
                }
                return prevCarreras;
            });
        }
    };

    return (
        <div className="container mt-5">
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

            {/* Contenido de la pestaña */}
            <div className="tab-content mt-3">
                {/* Visitante */}
                {selectedTab === 'visitante' && (
                    <div className="tab-pane fade show active">
                        <h3>
                            Equipo Visitante - <br/> Carreras anotadas
                            <button onClick={() => handleCarreras('visitante', 'decrement')} 
                            className="btn btn-danger btn-sm ml-3" 
                            style={{width:'30px', alignItems:'center', margin:'2px'}}>-</button>
                            <span className="ml-2"
                            style={{width:'30px', alignItems:'center', margin:'2px'}}>{carrerasVisitante}</span>
                            <button onClick={() => handleCarreras('visitante', 'increment')} 
                            className="btn btn-success btn-sm ml-2"
                            style={{width:'30px', alignItems:'center', margin:'2px'}}>+</button>
                        </h3>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {visitantes.map((player, index) => (
                                <li
                                    key={player.cont}
                                    style={{
                                        fontWeight: turnoVisitante === index ? 'bold' : 'normal',
                                        color: turnoVisitante === index ? 'green' : 'black',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <strong>{player.nombre} {player.apellido}</strong> 
                                    <input
                                        type="text"
                                        value={actions[`${player.nombre}-${player.apellido}`] || ''}
                                        disabled={editMode !== `${player.nombre}-${player.apellido}`}
                                        onChange={(e) => {
                                            const newActions = { ...actions };
                                            newActions[`${player.nombre}-${player.apellido}`] = e.target.value;
                                            setActions(newActions);
                                        }}
                                        style={{ marginLeft: '10px', width: '200px' }}
                                    />
                                    {editMode === `${player.nombre}-${player.apellido}` ? (
                                        <button onClick={handleUpdate} className="btn btn-success ml-2">
                                            Actualizar
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEdit('visitante')} className="btn btn-primary ml-2">
                                            Editar
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div>
                            <button onClick={() => handleAction('visitante', 'K')} className="btn btn-warning mt-2">K</button>
                            <button onClick={() => handleAction('visitante', 'H')} className="btn btn-success mt-2">H</button>
                            <button onClick={() => handleAction('visitante', '2b')} className="btn btn-primary mt-2">2b</button>
                            <button onClick={() => handleAction('visitante', '3b')} className="btn btn-info mt-2">3b</button>
                            <button onClick={() => handleAction('visitante', 'Home Run')} className="btn btn-danger mt-2">HR</button>
                            <button onClick={() => handleAction('visitante', 'BE')} className="btn btn-secondary mt-2">BE</button>
                            <button onClick={() => handleAction('visitante', 'F. out')} className="btn btn-dark mt-2">F. out</button>
                            <button onClick={() => handleAction('visitante', 'B.B')} className="btn btn-light mt-2">B.B</button>
                            <button onClick={() => handleAction('visitante', 'K1b')} className="btn btn-muted mt-2">K1b</button>
                        </div>
                        <button onClick={() => handleNextTurn('visitante')} className="btn btn-primary mt-3">
                            Siguiente Turno Visitante
                        </button>
                    </div>
                )}

                {/* Local */}
                {selectedTab === 'local' && (
                    <div className="tab-pane fade show active">
                        <h3>
                            Equipo Local - Carreras anotadas
                            <button onClick={() => handleCarreras('local', 'decrement')} 
                            className="btn btn-danger btn-sm ml-3"
                            style={{width:'30px', alignItems:'center', margin:'2px'}}>-</button>
                            <span className="ml-2" style={{width:'90px', alignItems:'center', margin:'0', }}>{carrerasLocal}</span>
                            <button onClick={() => handleCarreras('local', 'increment')} 
                            className="btn btn-success btn-sm ml-2" style={{width:'30px', alignItems:'center', margin:'2px'}}>+</button>
                        </h3>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {locales.map((player, index) => (
                                <li
                                    key={player.cont}
                                    style={{
                                        fontWeight: turnoLocal === index ? 'bold' : 'normal',
                                        color: turnoLocal === index ? 'green' : 'black',
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <strong>{player.nombre} {player.apellido}</strong> 
                                    <input
                                        type="text"
                                        value={actions[`${player.nombre}-${player.apellido}`] || ''}
                                        disabled={editMode !== `${player.nombre}-${player.apellido}`}
                                        onChange={(e) => {
                                            const newActions = { ...actions };
                                            newActions[`${player.nombre}-${player.apellido}`] = e.target.value;
                                            setActions(newActions);
                                        }}
                                        style={{ marginLeft: '10px', width: '200px' }}
                                    />
                                    {editMode === `${player.nombre}-${player.apellido}` ? (
                                        <button onClick={handleUpdate} className="btn btn-success ml-2">
                                            Actualizar
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEdit('local')} className="btn btn-primary ml-2">
                                            Editar
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div>
                            <button onClick={() => handleAction('local', 'K')} className="btn btn-warning mt-2">K</button>
                            <button onClick={() => handleAction('local', 'H')} className="btn btn-success mt-2">H</button>
                            <button onClick={() => handleAction('local', '2b')} className="btn btn-primary mt-2">2b</button>
                            <button onClick={() => handleAction('local', '3b')} className="btn btn-info mt-2">3b</button>
                            <button onClick={() => handleAction('local', 'Home Run')} className="btn btn-danger mt-2">HR</button>
                            <button onClick={() => handleAction('local', 'BE')} className="btn btn-secondary mt-2">BE</button>
                            <button onClick={() => handleAction('local', 'F. out')} className="btn btn-dark mt-2">F. out</button>
                            <button onClick={() => handleAction('local', 'B.B')} className="btn btn-light mt-2">B.B</button>
                            <button onClick={() => handleAction('local', 'K1b')} className="btn btn-muted mt-2">K1b</button>
                        </div>
                        <button onClick={() => handleNextTurn('local')} className="btn btn-primary mt-3">
                            Siguiente Turno Local
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loclvsvisitantes;
