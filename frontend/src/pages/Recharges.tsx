import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Recharges = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleCreateRecharge = () => {
    // Aquí iría la lógica para crear la recarga y generar el QR
    const rechargeData = { amount: parseFloat(amount) };
    console.log('Recarga creada:', rechargeData);
    // Simulamos la generación de un QR
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${amount}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Recargas</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
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
        <button
          onClick={handleCreateRecharge}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" /> Crear Recarga
        </button>
        {qrCode && (
          <div className="mt-1">
            <h2 className="text-xl font-bold mb-2">Código QR para la recarga</h2>
            <img src={qrCode} alt="QR Code" className="mx-auto"  width={300} height={300} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recharges;