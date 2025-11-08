import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_KANTIN: 'SET_KANTIN',
  LOAD_CART: 'LOAD_CART'
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      };
    
    // In CartContext.jsx, update the ADD_ITEM case:
    case CART_ACTIONS.ADD_ITEM:
    const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.warungId === action.payload.warungId
    );
    
    if (existingItem) {
        return {
        ...state,
        items: state.items.map(item =>
            item.id === action.payload.id && item.warungId === action.payload.warungId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        };
    }
    
    return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
    };


    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity < 1) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case CART_ACTIONS.SET_KANTIN:
      return {
        ...state,
        kantinInfo: action.payload
      };
    
    default:
      return state;
  }
}

const initialState = {
  items: [],
  kantinInfo: null
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedKantin = localStorage.getItem('kantinInfo');
    
    if (savedCart) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: JSON.parse(savedCart)
      });
    }
    
    if (savedKantin) {
      dispatch({
        type: CART_ACTIONS.SET_KANTIN,
        payload: JSON.parse(savedKantin)
      });
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.kantinInfo) {
      localStorage.setItem('kantinInfo', JSON.stringify(state.kantinInfo));
    } else {
      localStorage.removeItem('kantinInfo');
    }
  }, [state.kantinInfo]);

  // Action creators
  const addToCart = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const setKantin = (kantinInfo) => {
    // Validate that kantinInfo has the expected structure
    if (kantinInfo && typeof kantinInfo === 'object') {
      const validatedKantin = {
        id: kantinInfo.id,
        name: kantinInfo.name || '',
        description: kantinInfo.description || '',
        location: kantinInfo.location || '',
        image_url: kantinInfo.image_url || null
      };
      dispatch({ type: CART_ACTIONS.SET_KANTIN, payload: validatedKantin });
    }
  };

  const clearKantin = () => {
    dispatch({ type: CART_ACTIONS.SET_KANTIN, payload: null });
  };

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if current cart belongs to the selected kantin
  const isCartFromKantin = (kantinId) => {
    return state.kantinInfo?.id === kantinId;
  };

  // Clear cart and kantin when switching to a different kantin
  const switchKantin = (newKantinInfo) => {
    if (state.kantinInfo && state.kantinInfo.id !== newKantinInfo.id) {
      clearCart();
    }
    setKantin(newKantinInfo);
  };

  const value = {
    items: state.items,
    kantinInfo: state.kantinInfo,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setKantin,
    clearKantin,
    switchKantin,
    calculateTotal,
    getCartItemCount,
    isCartFromKantin
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};