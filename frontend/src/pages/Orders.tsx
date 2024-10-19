import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import OrderList from '../components/OrderList';
import NewOrderForm from '../components/NewOrderForm';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Obtener órdenes (datos mock por ahora)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Reemplaza esto con la llamada real cuando el endpoint esté disponible
        // const response = await axios.get('http://127.0.0.1:8000/orders');
        // setOrders(response.data);

        // Datos mock
        setOrders([
          {
            id: 1,
            products: ['PlayStation 5', 'Nintendo Switch'],
            total: 799.98,
            status: 'Pendiente',
          },
          {
            id: 2,
            products: ['Xbox Series X'],
            total: 499.99,
            status: 'Procesada',
          },
        ]);
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        // Maneja el error según sea necesario
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderCreation = () => {
    setIsCreatingOrder(!isCreatingOrder);
  };

  // Función para agregar una nueva orden al estado
  const addOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Órdenes</h1>
        <button
          onClick={toggleOrderCreation}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" /> Nueva Orden
        </button>
      </div>
      {isCreatingOrder ? (
        <NewOrderForm onCancel={toggleOrderCreation} onOrderCreated={addOrder} />
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
};

export default OrdersPage;
