import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditarVenta from './EditarVenta';

function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const cargarVentas = () => {
    axios.get('http://localhost:3000/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al obtener ventas:', err));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      axios.delete(`http://localhost:3000/ventas/${id}`)
        .then(res => {
          setMensaje(res.data.message || 'Venta eliminada con éxito');
          cargarVentas();
          setTimeout(() => setMensaje(''), 3000);
        })
        .catch(err => console.error('Error al eliminar venta:', err));
    }
  };

  return (
    <div className="card">
      <h2>Ventas Registradas</h2>
      {mensaje && <div className="notificacion">{mensaje}</div>}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td>{v.estudiante}</td>
                <td>{v.producto}</td>
                <td>{v.cantidad}</td>
                <td>${v.precio}</td>
                <td>${v.total}</td>
                <td>{v.fecha}</td>
                <td>
                  <button className="edit" onClick={() => setVentaSeleccionada(v)}>
                    Editar
                  </button>
                  <button className="danger" onClick={() => eliminarVenta(v.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ventaSeleccionada && (
        <EditarVenta 
          venta={ventaSeleccionada} 
          onUpdate={cargarVentas} 
          onClose={() => setVentaSeleccionada(null)}
        />
      )}
      <div className="
      "></div>

    </div>
    
  );
}

export default ListaVentas;