import React from 'react';
import { DollarSign, Package, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard icon={DollarSign} title="Ventas del día" value="$1,234.56" />
        <DashboardCard icon={RefreshCw} title="Últimas recargas" value="5" />
        <DashboardCard icon={Package} title="Órdenes pendientes" value="3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
          Crear nueva orden
        </button>
        <button className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-200">
          Procesar recarga
        </button>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Icon className="h-8 w-8 text-gray-500" />
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default Dashboard;