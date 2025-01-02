import { LOGUEO, USUARIOREGISTRADO, LINEUP, LISTAJUEGOS, CERRARUSUARIO, ACTUALIZARUSUARIO } from "./action-types";

//!firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../ControllerFirebase/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth'; // **IMPORTAR** la función desde Firebase
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'; // **IMPORTAR** Firestore

//!alertify
import alertify from 'alertifyjs';


export const actualizarUsuario = ()=>{
  return async (dispatch) => {
    // Despacha los datos combinados a Redux
    dispatch({
      type: ACTUALIZARUSUARIO,
      payload: true,
    });
  }
}

export const accesoUsuario = (email, password) => {
    return async (dispatch) => {
      try {
        // Autentica al usuario con Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Obtén los datos del usuario en Firestore
        const docRef = doc(db, "usuarios", user.uid);
        const userDoc = await getDoc(docRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
  
          // Despacha los datos combinados a Redux
          dispatch({
            type: LOGUEO,
            payload: {
              uid: user.uid,
              email: user.email,
              ...userData, // Incluye datos de Firestore
            },
          });
  
          alertify.success("Inicio de sesión exitoso");
         return true;
        } else {
          throw new Error("Usuario no encontrado en la base de datos.");
        }
      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        alertify.error("Error en el inicio de sesión: " + error.message);
      }
    };
  };

export const  cerrarLogeo = () =>{
  return async (dispatch) => {
    dispatch({
      type: CERRARUSUARIO,
      payload: false,
    });

  }
}



export const crearUsuario = (e, formData, isFormValid) => {
    return async (dispatch) => {
      e.preventDefault();
  
      if (isFormValid) {
        try {
          // Registra al usuario en Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const user = userCredential.user;
  
          // Ahora, guarda los datos en Firestore
          await setDoc(doc(db, "usuarios", user.uid), {
            nombre: formData.nombre,
            papellido: formData.papellido,
            sapellido: formData.sapellido,
            email: formData.email,
            fechaNacimiento: formData.fechaNacimiento,
            nivel: formData.nivel,
            tipo: 'Jugador'
          });
  
          alertify.success("Usuario registrado con éxito!");
  
          // Opcional: Despachar acción para actualizar el estado en Redux
          dispatch({
            type: USUARIOREGISTRADO,
            payload: {
              uid: user.uid,
              nombre: formData.nombre,
              papellido: formData.papellido,
              sapellido: formData.sapellido,
              email: formData.email,
              fechaNacimiento: formData.fechaNacimiento,
              nivel: formData.nivel,
            },
          });
          return true;
  
        } catch (error) {
          console.error("Error al registrar usuario:", error);
          alertify.error("Error al registrar usuario: " + error.message);
        }
      } else {
        alertify.error("Por favor, corrige los errores antes de continuar.");
      }
    };
  };


  export const lineUpAtleticos = (lineUp) =>{
    return async (dispatch) => {
      dispatch({
        type:LINEUP,
        payload:lineUp
      })
    }
  }

  export const listaJuegos = () => {
    return async (dispatch) => {
        try {
         
            const querySnapshot = await getDocs(collection(db, 'juegos'));
            const games = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const activeGamesList = games.filter(game => game.estado === 'activo');
          //  alert(JSON.stringify(activeGamesList))
            // Despachamos los juegos activos al store
            dispatch({
                type: LISTAJUEGOS,
                payload: activeGamesList
            });
        } catch (error) {
            console.error('Error al cargar los juegos activos desde Firebase:', error.message);

            // Opcional: despachar una acción de error si lo deseas
            dispatch({
                type: 'ERROR',
                payload: error.message
            });
        }
    };
};