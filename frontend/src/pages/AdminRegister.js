import { useState } from "react";
import { adminregister } from "../api/userApi";
import '../Styles/Register.css';


const AdminRegister = ({ onLogin }) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [api_key, setApi_key] = useState();

    const onRegisterClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await register(username, name, email, password, api_key);
            const { token } = response;
            onLogin(token);
        } catch (error) {
            console.error("Registering failed");
          
        }
    };
      
    return (
        <div className="registerFormbody">
            <form className="registerForm" onSubmit={onRegisterClicked}>
                <h1>Register</h1>
                <input className="registerForminput" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                <input className="registerForminput" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input  className="registerForminput" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input className="registerForminput" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <input className="registerForminput" placeholder="api key" value={api_key} onChange={e => setApi_key(e.target.value)} />
                <button className="registerFormbutton" disabled={!username || !password}>Register</button>
            </form>
        </div>
    );
}

export {AdminRegister}