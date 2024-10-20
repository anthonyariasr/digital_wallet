import React from 'react';
import { APIProduct } from '../types';

interface ProductItemProps {
  product: APIProduct;
  onAdd: (product: APIProduct) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAdd }) => {
  // Calculate discounted price if applicable
  const discountedPrice = product.sale
    ? (product.price * (100 - product.sale)) / 100
    : product.price;

  return (
    <li
      onClick={() => onAdd(product)}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-10 h-10 object-cover mr-2 rounded"
      />
      <div>
        <span className="font-semibold">{product.name}</span> -{' '}
        {product.sale ? (
          <>
            <span className="line-through text-gray-500">${product.price.toFixed(2)}</span>{' '}
            <span className="text-green-500">${discountedPrice.toFixed(2)}</span>{' '}
            <span className="text-red-500">-{product.sale}%</span>
          </>
        ) : (
          <span>${product.price.toFixed(2)}</span>
        )}
        <div className="text-sm text-gray-500">Stock: {product.stock}</div>
      </div>
    </li>
  );
};

export default ProductItem;
