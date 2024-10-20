import React from 'react';
import { Order } from '../types';
import OrderDetails from './OrderDetails';

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return <p className="text-center text-gray-500">No orders available.</p>;
  }

  return (
    <div>
      {orders.map((order, index) => (
        <OrderDetails  key={order.order_id || Math.random().toString(36).substr(2, 9)} order={order} />
        ))}
    </div>
  );
};

export default OrderList;
