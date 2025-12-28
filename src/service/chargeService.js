
// Fetch charges from backend API

const API_BASE =  import.meta.env.VITE_API_URL;

export const charges = async () => {
	try {
		const response = await fetch(`${API_BASE}/api/charges`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			throw new Error('Failed to fetch charges');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching charges:', error);
		throw error;
	}
};