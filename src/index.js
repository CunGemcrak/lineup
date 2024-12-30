import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css'; // Opcional, para temas
import { BrowserRouter } from "react-router-dom"; 
import { Provider } from "react-redux";
import store from "./Redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
        <App />
    
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

