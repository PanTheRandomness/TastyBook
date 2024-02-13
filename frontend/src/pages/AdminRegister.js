import { useState } from "react";
import { adminregister } from "../api/userApi";
import '../Styles/Register.css';
import { useNavigate } from "react-router-dom";


const AdminRegister = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [api_key, setApi_key] = useState('');
    const navigate = useNavigate();

    const onRegisterClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await adminregister(username, name, email, password, api_key);
            const { token } = response;
            onLogin(token);
            navigate("/");
        } catch (error) {
            window.alert("Registering failed.");
          
        }
    };
      
    return (
        <div className="registerFormbody">
            <form className="registerForm" onSubmit={onRegisterClicked}>
                <h1>Admin register</h1>
                <input className="registerForminput" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                <input className="registerForminput" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input  className="registerForminput" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input className="registerForminput" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <input className="registerForminput" placeholder="api key" value={api_key} onChange={e => setApi_key(e.target.value)} />
                <button className="registerFormbutton" disabled={!username || !password} data-testid="register-button">Register</button>
            </form>
        </div>
    );
}

export {AdminRegister}