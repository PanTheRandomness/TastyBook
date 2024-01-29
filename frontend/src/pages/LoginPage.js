import { useState } from "react";

const LoginPage = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    return(
    <div>
        <form>
            <h1>Login</h1>
            <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button disabled={!username || !password}>Login</button>

        </form>

    </div>
);}

export {LoginPage}