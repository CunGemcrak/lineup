import React from 'react';
import imagen from './img/giphy.gif';

const Loading = () => {
    const loadingStyle = {
        position: 'fixed',
        
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 100, 1, 0.8)', // Fondo oscuro semi-transparente
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Para asegurar que esté encima de otros elementos
    };
    const loadingStyleimg = {
        width: '100px',
        height: 'auto',
        zIndex: 1001, // Para asegurar que esté encima de otros elementos
    };

    return (
        <div style={loadingStyle}>
            <img src={imagen} alt="Cargando..." style={loadingStyleimg} />
          
        </div>
    );
};

export default Loading;
