import {
  LOGUEO, USUARIOREGISTRADO, LINEUP, LISTAJUEGOS, CERRARUSUARIO, ACTUALIZARUSUARIO} from "../Redux/action-types";

const initialState = {
  USER: false,
  ACTIONUSUARIO:null,
  LINEUPATLETICOS:null,
  JUEGOSACTIVOS:null
  
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
      case LOGUEO:
          return {
            ...state,
            USER: payload,
          };
      case USUARIOREGISTRADO:
        return{
          ...state,
          ACTIONUSUARIO:"Usuario Registrado con Exito"

        }
        case LINEUP:
          return {
            ...state,
            LINEUPATLETICOS:payload

          }
          case LISTAJUEGOS:
            return{
              ...state,
              JUEGOSACTIVOS:payload
  
            }
        case CERRARUSUARIO:
          return{
            ...state,
            USER:payload
          }
      case ACTUALIZARUSUARIO:
        return{
          ...state,
          USER:payload
        }
    default:
      return { ...state };
  }
};

export default reducer;

