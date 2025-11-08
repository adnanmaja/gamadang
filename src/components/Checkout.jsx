// Checkout.jsx or update your existing cart page
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/orderService';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, kantinInfo, calculateTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async () => {
    if (!currentUser || items.length === 0 || !kantinInfo) return;

    setLoading(true);
    try {
      // Get the first warung_id from cart items (assuming all items are from same warung)
      const warungId = items[0]?.warungId;

      if (!warungId) {
        alert('Invalid warung information');
        return;
      }

      // Prepare order items for API
      const orderItems = items.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      // Create order data according to API expectations
      const orderData = {
        user_id: currentUser.id, // Make sure your auth context provides user id
        warung_id: warungId,
        total_price: calculateTotal(),
        payment_status: "pending",
        order_items: orderItems
      };

      console.log('Creating order:', orderData);

      // Call your order service
      const result = await orderService.create(orderData);
      
      // Clear cart on success
      clearCart();
      
      // Navigate to order status or confirmation page
      navigate(`/status/${result.id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your checkout UI */}
      <button 
        onClick={handleCreateOrder} 
        disabled={loading || items.length === 0}
      >
        {loading ? 'Creating Order...' : 'Place Order'}
      </button>
    </div>
  );
}