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

        if (!response.ok) {
            let errorMessage = "Registration failed.";
            if (response.status === 409) {
                errorMessage = "Email or username is already in use.";
            }
            throw new Error(errorMessage);
        }

        return { ok: true };
    } catch (error) {
        throw error;
    }
};

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
            let errorMessage = "Registration failed.";
            if (response.status === 409) {
                errorMessage = "Email or username is already in use.";
            }
            throw new Error(errorMessage);
        }

        return { ok: true };
    } catch (error) {
        throw error;
    }
}

//userApi uudelle salasanalle
export const updatePassword = async (newPassword, verificationString) => {
    try {
        const response = await fetch(`${BASE_URL}/api/update-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ verificationString, newPassword }),
        });

        if (!response.ok) {
            throw new Error(`Password update failed: ${response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}

export const verifyEmail = async (verificationString) => {
    try {
        const response = await fetch(`${BASE_URL}/api/verify-email`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ verificationString })
        });

        if (!response.ok) throw new Error();
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/api/forgot-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        });
        if (!response.ok) throw new Error();
    } catch (error) {
        throw error;
    }
}