import { useState, useEffect } from "react";
import { useToken } from "./useToken";

export const useUser = () => {
    const [token] = useToken();

    const getPayloadFromToken = (token) => {
        try {
            const encodedPayload = token.split(".")[1];
            const decodedPayload = atob(encodedPayload);
            return JSON.parse(decodedPayload);
        } catch (error) {
            return null;
        }
    }

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            setUser(getPayloadFromToken(token));
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (token) => {
        setUser(getPayloadFromToken(token));
    }

    return { user, login };
}