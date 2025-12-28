// src/loaders/foodListLoader.js
import { fetchFoodList } from '../service/foodService';

export const foodListLoader = async () => {
  try {
    const data = await fetchFoodList();
    return data;
  } catch (error) {
    throw new Response('Failed to load food list', { status: 500 });
  }
};
