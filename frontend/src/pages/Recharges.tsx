import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Recharges = () => {
  const [recharges, setRecharges] = useState([
    { id: 1, amount: 50, status: 'Procesada', date: '2023-04-10' },
    { id: 2, amount: 100, status: 'Pendiente', date: '2023-04-11' },
  ]);
  const [isCreatingRecharge, setIsCreatingRecharge] = useState(false);

  const toggleRechargeCreation = () => {
    setIsCreatingRecharge(!isCreatingRecharge);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recargas</h1>
        <button
          onClick={toggleRechargeCreation}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" /> Nueva Recarga
        </button>
      </div>
      {isCreatingRecharge ? (
        <NewRechargeForm onCancel={toggleRechargeCreation} />
      ) : (
        <RechargeList recharges={recharges} />
      )}
    </div>
  );
};

const NewRechargeForm = ({ onCancel }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para crear la recarga
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Nueva Recarga</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Monto de la recarga
        </label>
        <input
          type="number"
          id="amount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 mr-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Crear Recarga
        </button>
      </div>
    </form>
  );
};

const RechargeList = ({ recharges }) => (
  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-gray-200 text-gray-700">
      <tr>
        <th className="py-3 px-4 text-left">ID</th>
        <th className="py-3 px-4 text-left">Monto</th>
        <th className="py-3 px-4 text-left">Estado</th>
        <th className="py-3 px-4 text-left">Fecha</th>
      </tr>
    </thead>
    <tbody>
      {recharges.map((recharge) => (
        <tr key={recharge.id} className="border-b border-gray-200 hover:bg-gray-100">
          <td className="py-3 px-4">{recharge.id}</td>
          <td className="py-3 px-4">${recharge.amount.toFixed(2)}</td>
          <td className="py-3 px-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                recharge.status === 'Procesada' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}
            >
              {recharge.status}
            </span>
          </td>
          <td className="py-3 px-4">{recharge.date}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Recharges;