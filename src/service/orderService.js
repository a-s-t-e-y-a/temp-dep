
const API_BASE =  import.meta.env.VITE_API_URL;

export async function fetchOrders(idToken) {
  try {
    const response = await fetch(`${API_BASE}/api/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}
