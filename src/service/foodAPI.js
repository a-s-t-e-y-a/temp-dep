import axios from 'axios';

export const searchFoods = async (query) => {
  try {
    console.log("📤 Sending search query:", query); // Debug what query is being sent
    const response = await axios.get(`/searchapi/search?q=${query}`);
    console.log("✅ Search API response:", response.data); // Log the response from API
    return response.data;
  } catch (error) {
    console.error("❌ Error searching foods:", error);
    throw error;
  }
};


