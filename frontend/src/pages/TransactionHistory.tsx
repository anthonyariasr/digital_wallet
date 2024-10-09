import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Venta', amount: 26.98, date: '2023-04-10 14:30' },
    { id: 2, type: 'Recarga', amount: 50, date: '2023-04-11 09:15' },
  ]);
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type.toLowerCase() === filter;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Historial de Transacciones</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <Filter className="mr-2" />
          <select
            className="border rounded-md py-2 px-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas las transacciones</option>
            <option value="venta">Ventas</option>
            <option value="recarga">Recargas</option>
          </select>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2" />
          <input type="date" className="border rounded-md py-2 px-3" />
        </div>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Tipo</th>
            <th className="py-3 px-4 text-left">Monto</th>
            <th className="py-3 px-4 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{transaction.id}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.type === 'Venta'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="py-3 px-4">${transaction.amount.toFixed(2)}</td>
              <td className="py-3 px-4">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;