import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../ControllerFirebase/firebase'; // Asegúrate de usar la ruta correcta para importar la base de datos
import alertify from 'alertifyjs'; // Importamos alertify

const CrearProgramacion = () => {
    const [formData, setFormData] = useState({
        gameName: '',
        homeClub: '',
        visitorTeam: '',
        gameDate: '',
        gameHour: '',
    });

    const [games, setGames] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'juegos'));
                const loadedGames = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setGames(loadedGames);
            } catch (error) {
                console.error('Error al cargar los juegos desde Firebase:', error.message);
            }
        };
        fetchGames();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCrearJuego = async (e) => {
        e.preventDefault();

        const newGame = {
            cont: Date.now(),
            campeonato: formData.gameName,
            equipoLocal: formData.homeClub,
            equipoVisitante: formData.visitorTeam,
            fechaJuego: formData.gameDate,
            horaJuego: formData.gameHour,
            estado: 'no jugado',
            carrerasLocal: 0,
            carrerasVisitante: 0,
        };

        try {
            const docRef = await addDoc(collection(db, 'juegos'), newGame);
            setGames([{ ...newGame, id: docRef.id }, ...games]);
            setFormData({
                gameName: '',
                homeClub: '',
                visitorTeam: '',
                gameDate: '',
                gameHour: '',
            });
            alert('Juego guardado en Firebase');
        } catch (error) {
            console.error('Error al guardar el juego en Firestore:', error.message);
            alert('Error: ' + error.message);
        }
    };

    const handleDeleteGame = async (id) => {
        try {
            await deleteDoc(doc(db, 'juegos', id));
            setGames(games.filter((game) => game.id !== id));
            alert('Juego eliminado con éxito');
        } catch (error) {
            console.error('Error al eliminar el juego:', error.message);
            alert('Error al eliminar el juego: ' + error.message);
        }
    };

    const handleUpdate = (game) => {
        setSelectedGame(game);
        setShowUpdateForm(true);
    };

    const handleCancelUpdate = () => {
        setShowUpdateForm(false);
    };

    const handleStartGame = async () => {
        if (selectedGame) {
            if (games.some(game => game.estado === 'activo')) {
                alertify.error('Solo un juego puede estar activo a la vez');
                return;
            }

            selectedGame.estado = 'activo';
            await updateDoc(doc(db, 'juegos', selectedGame.id), { estado: 'activo' });

            const updatedGames = games.map(game =>
                game.id === selectedGame.id ? selectedGame : game
            );
            setGames(updatedGames);
            alertify.success('Juego activado');
        }
        setShowUpdateForm(false);
    };

    const handleFinishGame = async () => {
        if (selectedGame && selectedGame.estado === 'activo') {
            selectedGame.estado = 'finalizado';
            await updateDoc(doc(db, 'juegos', selectedGame.id), { estado: 'finalizado' });

            const updatedGames = games.map(game =>
                game.id === selectedGame.id ? selectedGame : game
            );
            setGames(updatedGames);
            alertify.success('Juego finalizado');
        } else {
            alertify.error('El juego debe estar activo para finalizarlo');
        }
        setShowUpdateForm(false);
    };

    const handleCancelGame = () => {
        setShowUpdateForm(false);
    };

    const sortedGames = [...games].sort((a, b) => {
        const dateA = new Date(a.fechaJuego);
        const dateB = new Date(b.fechaJuego);
        if (a.estado !== b.estado) {
            return a.estado === 'finalizado' ? 1 : -1;
        }
        return dateA - dateB;
    });


















    
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 48%', minWidth: '300px' }}>
                <h2>Listado de Juegos</h2>
                <div>
                    {sortedGames.map((juego) => (
                        <div key={juego.id} style={{
                            border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '8px',
                            backgroundColor: juego.estado === 'activo' ? 'green' : juego.estado === 'finalizado' ? 'gray' : 'white'
                        }}>
                            <h3>{juego.campeonato}</h3>
                            <p><strong>Local:</strong> {juego.equipoLocal} | <strong>Visitante:</strong> {juego.equipoVisitante}</p>
                            <p><strong>Fecha:</strong> {juego.fechaJuego}</p>
                            <p><strong>Hora:</strong> {juego.horaJuego}:00</p>
                            <p><strong>Estado:</strong> {juego.estado}</p>
                            <p><strong>Resultado:</strong> {juego.carrerasLocal} - {juego.carrerasVisitante}</p>
                            <button onClick={() => handleUpdate(juego)} style={{ padding: '5px 10px', background: 'orange', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                                Actualizar
                            </button>
                            <button onClick={() => handleDeleteGame(juego.id)} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: '1 1 48%', minWidth: '300px', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
                <h2>Crear Juego de Softbol</h2>
                <form onSubmit={handleCrearJuego}>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="gameName">Nombre del Juego:</label>
                        <input type="text" id="gameName" name="gameName" value={formData.gameName} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="homeClub">Equipo Local:</label>
                        <input type="text" id="homeClub" name="homeClub" value={formData.homeClub} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="visitorTeam">Equipo Visitante:</label>
                        <input type="text" id="visitorTeam" name="visitorTeam" value={formData.visitorTeam} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="gameDate">Fecha del Juego:</label>
                        <input type="date" id="gameDate" name="gameDate" value={formData.gameDate} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="gameHour">Hora del Juego:</label>
                        <select id="gameHour" name="gameHour" value={formData.gameHour} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                            <option value="">Selecciona una hora</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((hour) => (
                                <option key={hour} value={hour}>{hour}:00</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                        Crear Juego
                    </button>
                </form>
            </div>

            {/* Formulario de actualización de estado */}
            {showUpdateForm && selectedGame && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                    <h3>Actualizar Estado de Juego</h3>
                    <p><strong>Juego:</strong> {selectedGame.campeonato}</p>
                    <button onClick={handleStartGame} style={{ marginRight: '10px' }}>Activar</button>
                    <button onClick={handleFinishGame} style={{ marginRight: '10px' }}>Finalizar</button>
                    <button onClick={handleCancelGame}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default CrearProgramacion;
