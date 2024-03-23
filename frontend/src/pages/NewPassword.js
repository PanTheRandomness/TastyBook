import { useState } from "react";
import '../Styles/NewPassword.css';
import { useNavigate, useParams } from "react-router-dom";
import { updatePassword } from "../api/userApi";

const NewPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { verificationString } = useParams();

    const onUpdatePasswordClicked = async (event) => {
        event.preventDefault();

        // Tarkista, että uudet salasanat ovat samat
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await updatePassword(newPassword, verificationString);

            navigate('/login');
        } catch (error) {
            setError("Password update failed.");
        }
    }

    return (
        <div className="passwordBody">
            <form className="passwordForm" onSubmit={onUpdatePasswordClicked}>
                <h1>Enter new password</h1>
                {error && <div className="error-message">{error}</div>}
                <input
                    className="passwordInput"
                    placeholder="New password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <input
                    className="passwordInput"
                    placeholder="Confirm new password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                />
                <button
                    className="passwordButton"
                    disabled={!newPassword || !confirmNewPassword}
                    data-testid="update-password-button"
                >
                    Update password
                </button>
            </form>
        </div>
    );
}

export { NewPassword };