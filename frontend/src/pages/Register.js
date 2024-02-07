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
            const response = await register(username, name, email, password);
            const { token } = response;
            onLogin(token);
        } catch (error) {
            console.error("Registering failed");
          
        }
    };
      
    return (
        <div className="registerFormbody">
            <div className="registerForm">
                <form onSubmit={onRegisterClicked}>
                    <h1>Register</h1>
                    <input className="registerForminput" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                    <input className="registerForminput" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input  className="registerForminput" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                    <input className="registerForminput" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="registerFormbutton" disabled={!name || !email || !username || !password} onSubmit={onRegisterClicked}>Register</button>
                </form>
                <div className="registerFormLoginContainer">
                    <h3>Have you already registered?</h3>
                    <button className="registerFormbutton" onSubmit={onRegisterClicked}>Login</button>
                </div>
            </div>
        </div>
    );
}

export {Register}