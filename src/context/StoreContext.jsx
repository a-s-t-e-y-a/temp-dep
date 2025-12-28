import React, { createContext, useEffect, useRef, useState } from 'react';
import { fetchFoodList } from '../service/foodService';
import { fetchComboList } from '../service/comboService';
import { fetchGiftingProducts } from '../service/foodService';
import { useAuth } from './AuthContext';
import { addToCart, getCartData, removeQtyFromCart } from '../service/cartService';
export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [comboList, setComboList] = useState([]);
  const [giftingList, setGiftingList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { idToken } = useAuth();
  const [token, setToken] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(localStorage.getItem("userLocation") || '');
  const [selectedAddressId, setSelectedAddressId] = useState(localStorage.getItem("savedAddressId") || '');

  // Cart logic moved to CartContext

  const logoutUser = () => {
    setToken('');
    setSelectedAddress('');
    localStorage.removeItem('token');
    localStorage.removeItem('userLocation');
    localStorage.removeItem('savedAddressId');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userId');
    localStorage.removeItem('guest');
    setSelectedAddressId('');
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      delete window.recaptchaVerifier;
    }
  };

  useEffect(() => {
    async function loadInitialData() {
      const foodItems = await fetchFoodList();
      const comboItems = await fetchComboList();
      const giftingItems = await fetchGiftingProducts();

      setFoodList(foodItems);
      setComboList(comboItems);
      setGiftingList(giftingItems);

      const merged = [...foodItems, ...comboItems, ...giftingItems];
      setAllProducts(merged);
    }

    loadInitialData();
  }, []);

  const contextValue = {
    foodList,
    comboList,
    allProducts,
    idToken,
    selectedAddress,
    setSelectedAddress,
    selectedAddressId,
    setSelectedAddressId,
    logoutUser
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};