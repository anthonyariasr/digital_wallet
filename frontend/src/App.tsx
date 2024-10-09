import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Recharges from './pages/Recharges';
import TransactionHistory from './pages/TransactionHistory';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Navigation />
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/recharges" element={<Recharges />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;