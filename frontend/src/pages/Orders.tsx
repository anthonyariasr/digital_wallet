import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrdersProps {
  selectedProducts: Product[];
  handleQuantityChange: (index: number, quantity: number) => void;
  onCancel: () => void;
}

const Orders: React.FC<OrdersProps> = ({ selectedProducts, handleQuantityChange, onCancel }) => {
  const [orders, setOrders] = useState([
    { id: 1, products: ['Producto 1', 'Producto 2'], total: 26.98, status: 'Pendiente' },
    { id: 2, products: ['Producto 3'], total: 15.99, status: 'Procesada' },
  ]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const toggleOrderCreation = () => {
    setIsCreatingOrder(!isCreatingOrder);
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
        <NewOrderForm onCancel={toggleOrderCreation} />
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
};

const NewOrderForm = ({ onCancel }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    setSearchTerm('');
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para crear la orden
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Nueva Orden</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-search">
          Buscar Producto
        </label>
        <div className="relative">
          <input
            type="text"
            id="product-search"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..."
          />
          <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
        </div>
        {/* Aquí iría la lista de resultados de búsqueda */}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Productos Seleccionados</h3>
        <Orders selectedProducts={selectedProducts} handleQuantityChange={handleQuantityChange} onCancel={onCancel} />
      </div>
    </form>
  );
};

const OrderList = ({ orders }) => (
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

export default Orders;