// OrderDetails.tsx
import React, { useState } from 'react';

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
  // Comprobaciones de seguridad
  if (!order) {
    return <div className="mb-6 p-4 bg-white rounded-lg shadow-md">No order data available.</div>;
  }

  const { order_id, client_id, total, products } = order;

  // Verificar si 'total' está definido
  const formattedTotal = typeof total === 'number' ? total.toFixed(2) : '0.00';

  const [showQR, setShowQR] = useState<boolean>(false);

  const handleShowQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Order ID: {order_id || 'N/A'}</h2>
      <p className="mb-2">Client ID: {client_id || 'N/A'}</p>
      <p className="mb-4">Total: ${formattedTotal}</p>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Product</th>
            <th className="text-left">Quantity</th>
            <th className="text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <tr key={product.product_id ? product.product_id : `product-${Math.random().toString(36).substr(2, 9)}`} className="border-b">
                <td className="py-2 px-4">{product.name || 'N/A'}</td>
                <td className="py-2 px-4">{product.quantity || 0}</td>
                <td className="py-2 px-4">
                  ${typeof product.subtotal === 'number' ? product.subtotal.toFixed(2) : '0.00'}
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
          <img src={`http://127.0.0.1:8000/images/order_${order_id}_qr.png`} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
