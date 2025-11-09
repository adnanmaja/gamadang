import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_KANTIN: 'SET_KANTIN',
  LOAD_CART: 'LOAD_CART',
  LOAD_KANTIN: 'LOAD_KANTIN'
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      };
    
    case CART_ACTIONS.LOAD_KANTIN:
      return {
        ...state,
        kantinInfo: action.payload
      };
    
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
  const loadedRef = useRef(false);

  // Load cart from localStorage on mount ONCE
  useEffect(() => {
    if (loadedRef.current) return; // Prevent multiple loads
    loadedRef.current = true;

    const savedCart = localStorage.getItem('cart');
    const savedKantin = localStorage.getItem('kantinInfo');
    
    if (savedCart) {
      try {
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: JSON.parse(savedCart)
        });
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
    
    if (savedKantin) {
      try {
        dispatch({
          type: CART_ACTIONS.LOAD_KANTIN,
          payload: JSON.parse(savedKantin)
        });
      } catch (e) {
        console.error('Failed to parse kantin from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage with debouncing to prevent spam
  const saveTimeoutRef = useRef(null);
  
  useEffect(() => {
    if (!loadedRef.current) return; // Don't save during initial load

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (state.items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } else {
        localStorage.removeItem('cart');
      }
    }, 100);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.items]);

  useEffect(() => {
    if (!loadedRef.current) return;

    if (state.kantinInfo) {
      localStorage.setItem('kantinInfo', JSON.stringify(state.kantinInfo));
    } else {
      localStorage.removeItem('kantinInfo');
    }
  }, [state.kantinInfo]);

  // Stable action creators
  const addToCart = useCallback((item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  const setKantin = useCallback((kantinInfo) => {
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
  }, []);

  const clearKantin = useCallback(() => {
    dispatch({ type: CART_ACTIONS.SET_KANTIN, payload: null });
  }, []);

  // Stable helper functions  
  const calculateTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const getCartItemCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const isCartFromKantin = useCallback((kantinId) => {
    return state.kantinInfo?.id === kantinId;
  }, [state.kantinInfo?.id]);

  const switchKantin = useCallback((newKantinInfo) => {
    if (state.kantinInfo && state.kantinInfo.id !== newKantinInfo.id) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
    if (newKantinInfo && typeof newKantinInfo === 'object') {
      const validatedKantin = {
        id: newKantinInfo.id,
        name: newKantinInfo.name || '',
        description: newKantinInfo.description || '',
        location: newKantinInfo.location || '',
        image_url: newKantinInfo.image_url || null
      };
      dispatch({ type: CART_ACTIONS.SET_KANTIN, payload: validatedKantin });
    }
  }, [state.kantinInfo?.id]);

  // Create stable context value using ref
  const valueRef = useRef();
  valueRef.current = {
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
    <CartContext.Provider value={valueRef.current}>
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