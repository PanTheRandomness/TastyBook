const BASE_URL = "http://localhost:3004";

export const register = async (username, name, email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, name, email, password }),
        });

        //kaksi eri erroria, toinen että säpo ja username jo käytössä, toinen että serveri kaatui
       
        if (!response.ok) {
            if (response.status === 409) {
                // Käyttäjätunnus tai sähköposti on jo käytössä
                throw new Error("Username or email is already in use.");
            } else {
                // Muut virhetilanteet
                throw new Error(`Registering failed: ${response.statusText}`);
            }
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

export const adminregister = async (username, name, email, password, api_key) => {
    try {
        const response = await fetch(`${BASE_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, name, email, password, api_key }),
        });

        if (!response.ok) {
            throw new Error(`Admin registering failed: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}
