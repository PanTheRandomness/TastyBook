import { useState } from "react";
import { register } from "../api/userApi";
import '../Styles/Register.css';
import '../Styles/RegistrationDialog.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);


    const onRegisterClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await register(username, name, email, password);
            setIsSuccessDialogOpen(response.ok);
        } catch (error) {
            setError(error.message);
        }
    };

    const closeSuccessDialog = () => {
        setIsSuccessDialogOpen(false);
    };

    return (
        <div className="register-border">
            <div className="registerFormbody">
                <div className="registerForm">
                    <form onSubmit={onRegisterClicked}>
                        <h1>Register</h1>
                        {error && <div className="error-message">{error}</div>}
                        <input className="registerForminput" placeholder="name" data-testid="name" value={name} onChange={e => setName(e.target.value)} />
                        <input className="registerForminput" placeholder="email" data-testid="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <input className="registerForminput" placeholder="username" data-testid="username" value={username} onChange={e => setUsername(e.target.value)} />
                        <input className="registerForminput" placeholder="password" data-testid="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="registerFormbutton" disabled={!name || !email || !username || !password} onSubmit={onRegisterClicked} data-testid="register-button">Register</button>
                    </form>
                    <div className="registerFormLoginContainer">
                        <h3>Have you already registered?</h3>
                        <button className="registerFormbutton" onClick={() => navigate("/login")} data-testid="login-button">Login</button>
                    </div>
                </div>
                {isSuccessDialogOpen && (
                    <div className="dialog-overlay" onClick={closeSuccessDialog}>
                        <div className="dialog-content">
                            <h3 data-testid="confirmation-message">You have received an email with a confirmation link.</h3>
                            <button className="dialog-button" onClick={closeSuccessDialog}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export { Register }