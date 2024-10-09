import React from 'react';

const Header = () => {
  const handlePopulateDB = () => {
    // Aquí iría la lógica para poblar la base de datos
    console.log('Populate DB clicked');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">POS System</h1>
      <button
        onClick={handlePopulateDB}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Populate DB
      </button>
    </header>
  );
};

export default Header;