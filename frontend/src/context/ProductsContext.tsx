import React, { createContext, useState } from 'react';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isPopulated, setIsPopulated] = useState(false);

  return (
    <ProductsContext.Provider value={{ products, setProducts, isPopulated, setIsPopulated }}>
      {children}
    </ProductsContext.Provider>
  );
};
