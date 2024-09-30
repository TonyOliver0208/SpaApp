import React, {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.appointmentId !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({children}) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        dispatch({type: 'CLEAR_CART'});
        JSON.parse(savedCart).forEach(item => {
          dispatch({type: 'ADD_TO_CART', payload: item});
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = item => {
    dispatch({type: 'ADD_TO_CART', payload: item});
  };

  const removeFromCart = appointmentId => {
    dispatch({type: 'REMOVE_FROM_CART', payload: appointmentId});
  };

  const clearCart = () => {
    dispatch({type: 'CLEAR_CART'});
  };

  return (
    <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart}}>
      {children}
    </CartContext.Provider>
  );
};
