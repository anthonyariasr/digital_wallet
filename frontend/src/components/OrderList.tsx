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
      {orders.map((order) => (
        <OrderDetails key={order.order_id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
