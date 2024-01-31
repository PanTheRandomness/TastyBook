import { useState, useEffect } from "react";
import { useToken } from "./useToken";

export const useUser = () => {
    const [token] = useToken();

    const getPayloadFromToken = (token) => {
        const encodedPayload = token.split(".")[1];
        return JSON.parse(atob(encodedPayload));
    }

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            setUser(getPayloadFromToken(token));
        } else {
            setUser(null);
        }
    }, [token]);

    return user;
}