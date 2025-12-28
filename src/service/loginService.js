
const API_BASE =  import.meta.env.VITE_API_URL;

export async function backendLogin(idToken) {
    const response = await fetch(`${API_BASE}/api/user/login-firebase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
}