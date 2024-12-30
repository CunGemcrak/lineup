import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB1W3PdxcxXxL7XfRLSKBicB964P77XAZI',
  authDomain: 'lineupatleticos.firebaseapp.com',
  projectId: 'lineupatleticos',
  storageBucket: 'lineupatleticos.appspot.com',
  messagingSenderId: '951641676080',
  appId: '1:951641676080:web:2e3713ba47ed25d7f2d0f5',
  measurementId: 'G-WSVWB96WCD',
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
