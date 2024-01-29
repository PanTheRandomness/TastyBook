import { useState } from "react";


const Register = ({ onLogin }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    
     
    return (
        <div className="contentContainer">
            <form>
                <h1>Register</h1>
                <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button disabled={!username || !password}>Register</button>
            </form>
            
            <div>Have you already registered?</div>
            <button >Log in</button>
        </div>
    );
}

export {Register}