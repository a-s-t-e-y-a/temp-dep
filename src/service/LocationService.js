// src/service/locationService.js

const API_BASE =  import.meta.env.VITE_API_URL;

// Utilities
const safeJSON = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
};

// Fetch user's saved addresses
export async function fetchSavedAddresses(token) {
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE}/api/address`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJSON(res);
    return Array.isArray(data) ? data : data.addresses || [];
  } catch (err) {
    console.error("Failed to fetch saved addresses:", err);
    throw err;
  }
}



// Save or update address
export async function saveAddress(payload, token) {
  if (!token) throw new Error("Unauthorized");
  const isEdit = !!payload.addressId;
  const url = isEdit ? `${API_BASE}/api/address/${payload.addressId}` : `${API_BASE}/api/address`;
  const method = isEdit ? 'PUT' : 'POST';
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const body = await safeJSON(res);
    if (!res.ok) throw new Error(body?.message || "Failed to save address");
    return body;
  } catch (err) {
    console.error("Saving address failed:", err);
    throw err;
  }
}

// Delete address
export async function deleteAddress(addressId, token) {
  if (!token) throw new Error("Unauthorized");
  try {
    const res = await fetch(`${API_BASE}/api/address/${addressId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await safeJSON(res);
      throw new Error(body?.message || "Failed to delete address");
    }
    return true;
  } catch (err) {
    console.error("Error deleting address:", err);
    throw err;
  }
}


// Search Google Places Autocomplete
export async function searchPlaces(query, apiKey, signal) {
  if (!query) return [];
  const placesUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:in&key=${apiKey}`;
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(placesUrl)}`, { signal });
    const data = await res.json();
    return Array.isArray(data?.predictions) ? data.predictions : [];
  } catch (err) {
    if (err.name !== "AbortError") console.error("Place suggestions error:", err);
    throw err;
  }
}

// Fetch Google Place Details by place_id
export async function fetchPlaceDetails(placeId, apiKey) {
  if (!placeId) return null;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data?.result || null;
  } catch (err) {
    console.error("Place details error:", err);
    throw err;
  }
}

// Reverse geocode lat,lng to address components
export async function reverseGeocode(lat, lng, apiKey) {
  if (!lat || !lng) return null;
  const reverseUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(reverseUrl)}`);
    const data = await response.json();
    return data?.results?.[0] || null;
  } catch (err) {
    console.error("Reverse geocode error:", err);
    throw err;
  }
}