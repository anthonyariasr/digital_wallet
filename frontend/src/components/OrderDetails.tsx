import React from 'react';
import { Order } from '../types';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Order ID: {order.order_id}</h2>
      <p className="mb-2">Client ID: {order.client_id}</p>
      <p className="mb-4">Total: ${order.total.toFixed(2)}</p>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Product</th>
            <th className="text-left">Quantity</th>
            <th className="text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product) => (
            <tr key={product.product_id} className="border-b">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.quantity}</td>
              <td className="py-2 px-4">${product.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;