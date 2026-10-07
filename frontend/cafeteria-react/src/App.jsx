import React from 'react';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Cafetería Escolar</h1>
      <FormularioVenta />
      <ListaVentas />
    </div>
  );
}

export default App;