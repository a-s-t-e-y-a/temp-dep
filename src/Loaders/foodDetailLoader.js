// src/loaders/foodDetailLoader.js
import { fetchFoodDetails } from '../service/foodService';

export const foodDetailLoader = async ({ params }) => {
  try {
    const data = await fetchFoodDetails(params.id);
    return data;
  } catch (error) {
    throw new Response('Failed to load food details', { status: 500 });
  }
};
