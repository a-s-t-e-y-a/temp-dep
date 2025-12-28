// src/loaders/foodListLoader.js
import { fetchComboList } from '../service/comboService';

export const comboListLoader = async () => {
  try {
    const data = await fetchComboList();
    return data;
  } catch (error) {
    throw new Response('Failed to load food list', { status: 500 });
  }
};
