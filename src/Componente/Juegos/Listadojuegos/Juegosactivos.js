import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../ControllerFirebase/firebase'; // Asegúrate de usar la ruta correcta para importar la base de datos
import alertify from 'alertifyjs'; // Importamos alertify

const Juegosactivos = () => {
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


        </div>
    );
};

export default Juegosactivos;
