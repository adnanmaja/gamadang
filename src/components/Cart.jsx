// components/Cart.jsx
import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Checkout from './Checkout';

const Cart = () => {
  const { items, kantinInfo, removeFromCart, updateQuantity, calculateTotal, getCartItemCount } = useCart();
  const { isLoggedIn } = useAuth();

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {kantinInfo && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h3 className="font-bold">Kantin: {kantinInfo.name}</h3>
          <p className="text-sm text-gray-600">{kantinInfo.location}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-gray-600">Rp {item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>Rp {calculateTotal().toLocaleString()}</span>
        </div>
        <div className="mt-2">
          {isLoggedIn ? (
            <Checkout />
          ) : (
            <p className="text-orange-500">Please login to checkout</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;