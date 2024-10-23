import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de instalar axios o puedes usar fetch si prefieres

interface Product {
  product_id: number;
  name: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  order_id: number;
  client_id: number;
  total: number;
  products: Product[];
}

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const [showQR, setShowQR] = useState<boolean>(false);
  const [orderProcessed, setOrderProcessed] = useState<boolean | null>(null);
  const [timer, setTimer] = useState<number>(60); // 60 seconds timer

  const handleShowQR = () => {
    setShowQR(!showQR);

    if (!showQR) {
      // Inicia el temporizador y haz la solicitud al backend para verificar el estado de la orden
      checkOrderStatus(order.order_id);
      startTimer();
    }
  };

  const checkOrderStatus = async (orderId: number) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/check-order-status/${orderId}`);
      if (response.data.message === 'Order processed successfully') {
        setOrderProcessed(true);
      } else {
        setOrderProcessed(false);
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      setOrderProcessed(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setShowQR(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Order ID: {order.order_id || 'N/A'}</h2>
      <p className="mb-2">Client ID: {order.client_id || 'N/A'}</p>
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
          {order.products && order.products.length > 0 ? (
            order.products.map((product) => (
              <tr key={product.product_id} className="border-b">
                <td className="py-2 px-4">{product.name || 'N/A'}</td>
                <td className="py-2 px-4">{product.quantity || 0}</td>
                <td className="py-2 px-4">
                  ${product.subtotal.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-2 px-4 text-center">
                No products in this order.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={handleShowQR}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        {showQR ? 'Hide QR' : 'Show QR'}
      </button>
      {showQR && (
        <div className="mt-4">
          <img src={`http://127.0.0.1:8000/images/order_${order.order_id}_qr.png`} alt="QR Code" />
          <p>Time remaining: {timer} seconds</p>
        </div>
      )}
      {orderProcessed === true && <p className="mt-4 text-green-500">Order processed successfully!</p>}
      {orderProcessed === false && <p className="mt-4 text-red-500">Order could not be processed.</p>}
    </div>
  );
};

export default OrderDetails;
