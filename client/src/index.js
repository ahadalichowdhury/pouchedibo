import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ToastContainer} from "react-toastify"
import "./assets/css/bootstrap.css";
import "./assets/css/animate.min.css";
import "./assets/css/style.css";
import store from "./Redux/store/store";
import { Provider } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import 'mapbox-gl/dist/mapbox-gl.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
    <App />
    </Provider>
  </React.StrictMode>
);


