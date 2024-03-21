import { useState } from "react";
import { adminregister } from "../api/userApi";
import '../Styles/Register.css';
import '../Styles/RegistrationDialog.css';

const AdminRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [api_key, setApi_key] = useState('');
    const [error, setError] = useState(null);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    const onRegisterClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await adminregister(username, name, email, password, api_key);
            setIsSuccessDialogOpen(response.ok);
        } catch (error) {
            setError(error.message);
        }
    };
    
        const closeSuccessDialog = () => {
            setIsSuccessDialogOpen(false); 
          };
      
    return (
        <div className = "register-border">
        <div className="registerFormbody">
            <div className="registerForm">
            <form onSubmit={onRegisterClicked}>
                <h1>Admin register</h1>
                {error && <div className="error-message">{error}</div>}
                <input className="registerForminput" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                <input className="registerForminput" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input  className="registerForminput" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input className="registerForminput" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <input className="registerForminput" placeholder="api key" value={api_key} onChange={e => setApi_key(e.target.value)} />
                <button className="registerFormbutton" disabled={!username || !password} data-testid="register-button">Register</button>
            </form>
            </div>
            {isSuccessDialogOpen && (
                <div className="dialog-overlay" onClick={closeSuccessDialog}>
                    <div className="dialog-content">
                    <h3>You have received an email with a confirmation link.</h3>
                    <button className="dialog-button" onClick={closeSuccessDialog}>OK</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export {AdminRegister}