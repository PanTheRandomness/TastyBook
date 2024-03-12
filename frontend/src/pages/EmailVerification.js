import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../api/userApi";

const EmailVerification = () => {
    const { verificationString } = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyEmail(verificationString);
                setErrorMessage("");
                navigate("/login");
            } catch (error) {
                setErrorMessage("Email verification failed");
            } finally {
                setLoading(false);
            }
        }

        verify();
    }, [verificationString]);

    if (!loading && errorMessage) return <div data-testid="error">{errorMessage}</div>;
    else return null;
}

export default EmailVerification;