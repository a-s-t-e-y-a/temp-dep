// src/service/foodService.js
import axios from 'axios';
import axiosInstance from './axiosInstance';

export const fetchFoodList = async () => {
  try {
    const response = await axiosInstance.get('/foods');
    return response.data;
  } catch (error) {
    console.log('Error fetching food list:', error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  if (!id) {
    throw new Error("Invalid food ID");
  }

  try {
    const response = await axiosInstance.get(`/foods/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching food details:', error);
    throw error;
  }
};

export const fetchGiftingProducts = async () => {
  try {
    const response = await axiosInstance.get('/giftboxes');
    return response.data;
  } catch (error) {
    console.log('Error fetching food list:', error);
    throw error;
  }
};


export async function fetchBestsellers(){
  try{
    const response = await fetch('https://recsys.letstryfoods.com/api/recommendations/bestsellers');
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return data;
  }
  catch(error){
    throw error;
  }
}
