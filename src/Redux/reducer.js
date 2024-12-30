import {
  LOGUEO, USUARIOREGISTRADO, LINEUP, LISTAJUEGOS } from "../Redux/action-types";

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
    default:
      return { ...state };
  }
};

export default reducer;

