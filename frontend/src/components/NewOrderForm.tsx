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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products');

        // Verify if response.data.products is an array
        if (response.data && Array.isArray(response.data.products)) {
          setAvailableProducts(response.data.products);
        } else {
          console.error('Unexpected data format:', response.data);
          setAvailableProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAvailableProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
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
    // Prevent adding the same product more than once
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) return;

    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    setSearchTerm('');
    setFilteredProducts([]);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];

    // Check if the new quantity exceeds stock
    if (newQuantity > product.stock) {
      alert(`Insufficient stock for ${product.name}. Available stock: ${product.stock}`);
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
  
    // Validate that at least one product is selected
    if (selectedProducts.length === 0) {
      alert('Please select at least one product for the order.');
      return;
    }
  
    // Extract product IDs and quantities into separate arrays
    const product_ids = selectedProducts.map((p) => p.id);
    const quantities = selectedProducts.map((p) => p.quantity);
  
    // Optional: If you have a client_id, include it. Otherwise, you can omit or set to null.
    const client_id = null; // Replace with actual client ID if available
  
    // Prepare data to send
    const orderData = {
      product_ids,
      quantities,
    };

  
    setIsSubmitting(true);
    setError(null);
  
    try {
      console.log('Sending Order Data:', orderData);
      const response = await axios.post('http://127.0.0.1:8000/create-order', orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Since the backend returns a message and qr_path, handle accordingly
      const { message, qr_filename } = response.data;
      alert(`${message}\nQR Code Path: ${qr_filename}`);
  
      // Optionally, refetch the orders or update the state
      onOrderCreated(response.data); // Adjust this based on what you need
      // Clear the form
      setSelectedProducts([]);
      setSearchTerm('');
      setFilteredProducts([]);
      onCancel();
    } catch (error: any) {
      console.error('Error creating order:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to create order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">New Order</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-search">
          Search Product
        </label>
        <div className="relative">
          <input
            type="text"
            id="product-search"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product..."
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
        <h3 className="text-lg font-semibold mb-2">Selected Products</h3>
        {selectedProducts.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Price</th>
                <th className="text-left">Subtotal</th>
                <th className="text-left">Actions</th>
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
                    <td className="py-2 px-4">${(discountedPrice * product.quantity).toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No products selected.</p>
        )}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default NewOrderForm;
