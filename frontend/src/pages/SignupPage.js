import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";

const SignupPage = ({ onLogin }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();

    const onSignupClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await signup(username, password);
            const { token } = response;
            onLogin(token);
            navigate("/user");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    return (
        <div className="contentContainer">
            <form onSubmit={onSignupClicked}>
                <h1>Register</h1>
                {errorMessage && <div>{errorMessage}</div>}
                <input placeholder="nimimerkki" value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="salasana" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button disabled={!username || !password}>Rekisteröidy</button>
            </form>
            
            <div>Have you already registered?</div>
            <button onClick={() => navigate("/login")}>Kirjaudu</button>
        </div>
    );
}

export default SignupPage;