import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { APIProduct, SelectedProduct, Order } from '../types';
import ProductItem from './ProductItem';

interface NewOrderFormProps {
  onCancel: () => void;
  onOrderCreated: (order: Order) => void;
}

const NewOrderForm: React.FC<NewOrderFormProps> = ({ onCancel, onOrderCreated }) => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState<APIProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<APIProduct[]>([]);

  // Obtener productos desde el endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products');

        // Verificar si response.data.products es un array
        if (response.data && Array.isArray(response.data.products)) {
          setAvailableProducts(response.data.products);
        } else {
          console.error('Formato de datos inesperado:', response.data);
          setAvailableProducts([]);
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        setAvailableProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const results = availableProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(results);
  }, [searchTerm, availableProducts]);

  const handleAddProduct = (product: APIProduct) => {
    // Evitar agregar el mismo producto más de una vez
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) return;

    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    setSearchTerm('');
    setFilteredProducts([]);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];

    // Verificar que la cantidad no exceda el stock
    if (newQuantity > product.stock) {
      alert(`No hay suficiente stock para ${product.name}. Stock disponible: ${product.stock}`);
      return;
    }

    product.quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (id: number) => {
    const updatedProducts = selectedProducts.filter((p) => p.id !== id);
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que haya al menos un producto seleccionado
    if (selectedProducts.length === 0) {
      alert('Selecciona al menos un producto para la orden.');
      return;
    }

    // Calcular total con descuentos aplicados
    const total = selectedProducts.reduce((acc, product) => {
      const discountedPrice = product.sale
        ? (product.price * (100 - product.sale)) / 100
        : product.price;
      return acc + discountedPrice * product.quantity;
    }, 0);

    // Preparar datos para enviar
    const orderData = {
      products: selectedProducts.map((p) => ({ id: p.id, quantity: p.quantity })),
      total,
      status: 'Pendiente', // Puedes ajustar el estado según tus necesidades
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/create-order', orderData);
      const newOrder: Order = response.data;

      // Asumiendo que el API devuelve la orden creada con id, productos como array de nombres, total y estado
      onOrderCreated(newOrder);

      // Limpiar formulario
      setSelectedProducts([]);
      setSearchTerm('');
      setFilteredProducts([]);
      onCancel();
    } catch (error) {
      console.error('Error al crear la orden:', error);
      alert('Hubo un error al crear la orden. Por favor, intenta nuevamente.');
    }
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
        {filteredProducts.length > 0 && (
          <ul className="border border-gray-200 mt-2 max-h-40 overflow-y-auto">
            {filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} onAdd={handleAddProduct} />
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Productos Seleccionados</h3>
        {selectedProducts.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Producto</th>
                <th className="text-left">Cantidad</th>
                <th className="text-left">Precio</th>
                <th className="text-left">Total</th>
                <th className="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => {
                const discountedPrice = product.sale
                  ? (product.price * (100 - product.sale)) / 100
                  : product.price;
                return (
                  <tr key={product.id} className="border-b">
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value) || 1)
                        }
                        className="w-16 border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4">
                      {product.sale ? (
                        <>
                          <span className="line-through text-gray-500">
                            ${product.price.toFixed(2)}
                          </span>{' '}
                          <span className="text-green-500">${discountedPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      ${ (discountedPrice * product.quantity).toFixed(2) }
                    </td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No hay productos seleccionados.</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Crear Orden
        </button>
      </div>
    </form>
  );
};

export default NewOrderForm;
