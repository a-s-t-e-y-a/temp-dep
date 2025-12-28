const API_BASE =  import.meta.env.VITE_API_URL;

export const initiateUpiIntent = async (intentData, idToken) => {
    try{
        const response = await fetch(`${API_BASE}/api/zaakpay/upi-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(intentData),
        });
        const data = await response.json();
        return data;
    } 
    catch(error){
        console.log('Error initiating UPI intent:', error);
        throw error;
    }
};