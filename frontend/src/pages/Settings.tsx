import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: 'Tienda de Electrodomésticos',
    address: 'Santa Clara, San Carlos, Costa Rica',
    phone: '8888-8888',
    email: 'electro@itcr.com',
    taxRate: 0.16,
    currency: 'USD',
    printerEnabled: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar la configuración
    console.log('Configuración guardada:', settings);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessName">
              Nombre del Negocio
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={settings.businessName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taxRate">
              Tasa de Impuesto
            </label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currency">
              Moneda
            </label>
            <select
              id="currency"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="CRC">Colón Costarricense (CRC)</option>
              <option value="USD">Dólar Estadounidense (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="printerEnabled"
              checked={settings.printerEnabled}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Habilitar impresora de tickets</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
          >
            <Save className="mr-2" /> Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;