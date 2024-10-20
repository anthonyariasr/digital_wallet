// src/pages/Recharges.tsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { RechargeResponse } from '../types';

const Recharges = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRecharge = async () => {
    // Validar que el monto sea mayor que 0
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Por favor, ingresa un monto válido mayor que 0.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<RechargeResponse>(
        'http://127.0.0.1:8000/qr-code/recharge',
        {}, // Enviar cuerpo vacío
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            amount: parsedAmount, // Enviar 'amount' como parámetro de consulta
          },
        }
      );

      const { message, qr_path } = response.data;
      console.log(message, qr_path);

      // Construir la URL completa del QR code
      const qrUrl = `http://127.0.0.1:8000/${qr_path}`;
      setQrCode(qrUrl);
      console.log(qrCode);
    } catch (err: any) {
      console.error('Error creando la recarga:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          // Extraer mensajes de error de cada objeto en el array
          const errorMessages = detail.map((d: any) => d.msg).join(' ');
          setError(errorMessages);
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError('Hubo un error al crear la recarga. Por favor, intenta nuevamente.');
        }
      } else {
        setError('Hubo un error al crear la recarga. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
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
            min="0.01"
            step="0.01"
            required
            placeholder="Ingresa el monto..."
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleCreateRecharge}
          className={`${
            isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          } text-white py-2 px-4 rounded-lg transition duration-200 flex items-center`}
          disabled={isLoading}
        >
          <Plus className="mr-2" /> {isLoading ? 'Creando...' : 'Crear Recarga'}
        </button>
        {qrCode && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Código QR para la recarga</h2>
            <img src={qrCode} alt="QR Code" className="mx-auto" width={300} height={300} />
            <p className="mt-2 text-gray-600">
              Puedes escanear este código QR para completar tu recarga.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recharges;
