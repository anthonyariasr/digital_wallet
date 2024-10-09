import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Producto 1', price: 10.99, stock: 100 },
    { id: 2, name: 'Producto 2', price: 15.99, stock: 50 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const openModal = (product = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para agregar o actualizar producto
    closeModal();
  };

  const handleDelete = (id) => {
    // Lógica para eliminar producto
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" /> Agregar Producto
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">Precio</th>
            <th className="py-3 px-4 text-left">Stock</th>
            <th className="py-3 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4">${product.price.toFixed(2)}</td>
              <td className="py-3 px-4">{product.stock}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => openModal(product)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {currentProduct ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={currentProduct?.name}
                />
              </div>
              {/* Agregar más campos según sea necesario */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;