import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, RefreshCw, Clock, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Productos' },
    { path: '/orders', icon: ShoppingCart, label: 'Órdenes' },
    { path: '/recharges', icon: RefreshCw, label: 'Recargas' },
    { path: '/history', icon: Clock, label: 'Historial' },
    { path: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <nav className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2">
      <div className="text-2xl font-semibold text-center mb-6">POS System</div>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
            location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;