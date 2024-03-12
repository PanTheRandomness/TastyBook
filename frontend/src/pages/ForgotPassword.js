import { useState } from "react";
import { forgotPassword } from "../api/userApi";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmitClicked = async () => {
        try {
            await forgotPassword(email);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Reset link failed");
        }
    }

    if (errorMessage) return <div>{errorMessage}</div>

    return (
        <div>
            <h1>Forgot Password</h1>
            <p>Enter your email and we'll send you a reset link</p>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
            <button disabled={!email} onClick={onSubmitClicked}>Send reset link</button>
        </div>  
    );
}

export default ForgotPassword;