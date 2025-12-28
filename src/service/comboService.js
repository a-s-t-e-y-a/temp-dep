import axios from "axios";
const API_BASE =  import.meta.env.VITE_API_URL;

const API_URL = `${API_BASE}/api/combos`;

export const fetchComboList = async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
            
        } catch (error) {
            console.log("Error fetching food list:", error);
            throw error;
        }
    };

export const fetchComboDetails = async (id) => {
        
        try {
            const response = await axios.get(API_URL+"/"+id);
            return response.data;
        } catch (error) {
            console.log('error fetching food details:', error);
            throw error;
            
        }
    }