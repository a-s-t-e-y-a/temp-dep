
const API_BASE =  import.meta.env.VITE_API_URL;

export async function getprofile(idToken) {
  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        Accept: 'application/json',
      },
    });
    // Only try to parse JSON if there is content
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

export async function updateProfile({ name, email, dob, idToken }) {
  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ name, email, dob }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
