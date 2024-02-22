import { useState } from "react";
import { login } from "../api/userApi";
import '../Styles/Login.css';
import { useNavigate } from "react-router-dom";

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onLoginClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await login(username, password);
            const { token } = response;
            onLogin(token);
            navigate('/');
        } catch (error) {
            setError("Logging in failed.");
        }
    }

    return(
    <div className="loginFormbody">
        <form className="loginForm" onSubmit={onLoginClicked}>
            <h1>Login</h1>
            {error && <div className="error-message">{error}</div>}
            <input className="loginForminput"  placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="loginForminput" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="loginFormbutton" disabled={!username || !password} data-testid="login-button">Login</button>
        </form>
    </div>
);}

export {Login}