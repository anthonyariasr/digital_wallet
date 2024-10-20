import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import OrderList from '../components/OrderList';
import NewOrderForm from '../components/NewOrderForm';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/orders');
        if (response.data && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setError('Unexpected response format.');
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError('No orders found.');
        } else {
          setError('Failed to fetch orders.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderCreation = () => {
    setIsCreatingOrder(!isCreatingOrder);
  };

  // Function to add a new order to the state
  const addOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <button
          onClick={toggleOrderCreation}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" /> New Order
        </button>
      </div>
      {isCreatingOrder ? (
        <NewOrderForm onCancel={toggleOrderCreation} onOrderCreated={addOrder} />
      ) : (
        <>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <OrderList orders={orders} />
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
