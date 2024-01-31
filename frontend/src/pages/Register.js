import { useState } from "react";
import { register } from "../api/userApi";


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
            navigate("/user");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
      
    return (
        <div className="contentContainer">
            <form onSubmit={onRegisterClicked}>
                <h1>Register</h1>
                <input placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button disabled={!username || !password}>Register</button>
            </form>
            
            <div>Have you already registered?</div>
            <button >Login</button>
        </div>
    );
}

export {Register}