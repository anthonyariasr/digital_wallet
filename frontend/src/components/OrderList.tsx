import React from 'react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-gray-200 text-gray-700">
      <tr>
        <th className="py-3 px-4 text-left">ID</th>
        <th className="py-3 px-4 text-left">Productos</th>
        <th className="py-3 px-4 text-left">Total</th>
        <th className="py-3 px-4 text-left">Estado</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
          <td className="py-3 px-4">{order.id}</td>
          <td className="py-3 px-4">{order.products.join(', ')}</td>
          <td className="py-3 px-4">${order.total.toFixed(2)}</td>
          <td className="py-3 px-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                order.status === 'Procesada' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}
            >
              {order.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderList;
