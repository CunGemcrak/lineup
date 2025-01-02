import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listaJuegos } from '../../Redux/actions';
import Loading from '../Loading/Loading';

const Home = () => {
    const dispatch = useDispatch();
    const Listajuegos = useSelector((store) => store.JUEGOSACTIVOS || []);
    const [activeGames, setActiveGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);  // Inicializamos como null
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showComponent , setShowComponent] = useState(true)
    // Efecto para cargar los juegos al montar el componente
    useEffect(() => {
        dispatch(listaJuegos());
     //   alert("entro")
    }, [dispatch]);



    useEffect(() => {
        // Mostrar el componente
        setShowComponent(true);
    
        // Ocultar el componente después de 2 segundos
        const timer = setTimeout(() => {
            setShowComponent(false);
        }, 2000);
    
        // Limpiar el temporizador si el componente se desmonta
        return () => clearTimeout(timer);
    }, []); 
    // Efecto para actualizar los juegos activos cuando llegan desde Redux




    
    useEffect(() => {
        if (Listajuegos.length > 0) {
            setActiveGames(Listajuegos.filter(game => game.estado === 'activo'));
            setLoading(false);  // Seteamos loading a false cuando los juegos se cargan
        }
    }, [Listajuegos]);

    // Ordenamos los juegos activos por fecha
    const sortedGames = [...activeGames].sort((a, b) => {
        const dateA = new Date(a.fechaJuego);
        const dateB = new Date(b.fechaJuego);
        return dateA - dateB;
    });

    // Función para manejar la actualización de un juego
    const handleUpdate = (game) => {
        setSelectedGame(game);
        setShowUpdateForm(true);
    };

    return (
        <div>
            {/* Verifica si hay juegos activos */}
            {showComponent ?<Loading/>:null}
            {loading ? (
                <p>Cargando juegos...</p>
            ) : activeGames.length === 0 ? (
                <p>No hay juegos activos en este momento.</p>
            ) : (
                <div>
                    <h2>Listado de Juegos Activos</h2>
                    <div>
                        {sortedGames.map((juego) => (
                            <div
                                key={juego.id}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    borderRadius: '8px',
                                    backgroundColor:
                                        juego.estado === 'activo'
                                            ? 'green'
                                            : juego.estado === 'finalizado'
                                            ? 'gray'
                                            : 'white',
                                }}
                            >
                                <h3>{juego.campeonato}</h3>
                                <p>
                                    <strong>Local:</strong> {juego.equipoLocal} |{' '}
                                    <strong>Visitante:</strong> {juego.equipoVisitante}
                                </p>
                                <p>
                                    <strong>Fecha:</strong> {juego.fechaJuego}
                                </p>
                                <p>
                                    <strong>Hora:</strong> {juego.horaJuego}:00
                                </p>
                                <p>
                                    <strong>Estado:</strong> {juego.estado}
                                </p>
                                <p>
                                    <strong>Resultado:</strong> {juego.carrerasLocal} -{' '}
                                    {juego.carrerasVisitante}
                                </p>
                                <button
                                    onClick={() => handleUpdate(juego)}
                                    style={{
                                        padding: '5px 10px',
                                        background: 'orange',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                    }}
                                >
                                    Ver
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
