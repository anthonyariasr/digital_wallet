import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleIncrement = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: Math.max((prevCart[productId] || 0) - 1, 0),
    }));
  };

  const handleCreateOrder = () => {
    const order = Object.entries(cart).map(([productId, quantity]) => ({
      productId: parseInt(productId),
      quantity,
    }));
    console.log('Orden creada:', order);
    // Aquí iría la lógica para enviar la orden al servidor
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleDecrement(product.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                <Minus size={16} />
              </button>
              <span className="mx-2">{cart[product.id] || 0}</span>
              <button
                onClick={() => handleIncrement(product.id)}
                className="bg-green-500 text-white p-1 rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleCreateOrder}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
      >
        <ShoppingCart className="mr-2" /> Crear Orden
      </button>
    </div>
  );
};

export default Products;
