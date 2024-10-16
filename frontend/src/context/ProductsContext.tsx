import React, { createContext, useState, useEffect } from 'react';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isPopulated, setIsPopulated] = useState(false);
  const [error, setError] = useState(null);

  const checkPopulation = () => {
    fetch('http://127.0.0.1:8000/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('No products found.');
        }
        return response.json();
      })
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          if (data.products.length > 0) {
            setIsPopulated(true);
          }
        } else {
          throw new Error('Malformed response.');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  };

  useEffect(() => {
    checkPopulation();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, isPopulated, setIsPopulated, error, checkPopulation }}>
      {children}
    </ProductsContext.Provider>
  );
};
