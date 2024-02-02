import { useState } from "react";
import { login } from "../api/userApi";
import '../Styles/Login.css';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const onLoginClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await login(username, password);
            const { token } = response;
            onLogin(token)
        } catch (error) {
            console.error("Rekisteröityminen epäonnistui");
        }
    }

    return(
    <div className="loginContainer">
        <form className="loginForm" onSubmit={onLoginClicked}>
            <h1>Login</h1>
            <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button disabled={!username || !password}>Login</button>
        </form>
    </div>
);}

export {Login}