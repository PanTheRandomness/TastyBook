import { useState } from "react";
import { register } from "../api/userApi";
import '../Styles/Register.css';


const Register = ({ onLogin }) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const onRegisterClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await register(username, password);
            const { token } = response;
            onLogin(token);
        } catch (error) {
            console.error("Rekisteröityminen epäonnistui");
          
        }
    };
      
    return (
        <div className="registerContainer">
            <form className="loginForm" onSubmit={onRegisterClicked}>
                <h1>Register</h1>
                <input placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="register" disabled={!username || !password}>Register</button>
        
            <div>Have you already registered?</div>
            <button >Login</button>
            </form>
        </div>
    );
}

export {Register}