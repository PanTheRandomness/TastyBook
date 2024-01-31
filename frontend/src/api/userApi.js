const BASE_URL = "http://localhost:3004";

export const register = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`Registering failed: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}

export const login = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}