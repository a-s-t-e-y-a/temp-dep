// src/service/cartService.js
import axios from './axiosInstance';
const API_BASE =  import.meta.env.VITE_API_URL;


export const addToCart = async (foodId,idToken) => {
  try {
    const response = await fetch(`${API_BASE}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
                   Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ foodId }),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) {
    console.error('Error while adding to cart:', error.message);
    return null;
  }
};

export const removeQtyFromCart = async (foodId,idToken) => {
  try {
    const response = await fetch(`${API_BASE}/api/cart/subtract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
                   Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ foodId }),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) {
    console.error('Error while removing from cart:', error.message);
    return null;
  }
};
export const getCartData = async (idToken) => {
  try {
    const response = await fetch(`${API_BASE}/api/cart`, {
      method: 'GET',
      headers: {
                   Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    const itemsObj = data.items;
    const itemsArray = Object.entries(itemsObj).map(([id, quantity]) => ({
      id,
      quantity,
    }));
    return itemsArray;
  } catch (error) {
    console.error('Error while fetching cart data:', error.message);
    return [];
  }
};
