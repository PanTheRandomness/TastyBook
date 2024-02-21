import { useState } from "react";
import '../Styles/NewPassword.css';
import { useNavigate } from "react-router-dom"

const NewPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    const onUpdatePasswordClicked = async (event) => {
        event.preventDefault();

        // Tarkista, että uudet salasanat ovat samat
        if (newPassword !== confirmNewPassword) {
            window.alert("Passwords do not match.");
            return;
        }

        try {
            // Tässä voit käyttää sopivaa API-kutsua salasanan päivittämiseksi
            //await updatePassword(newPassword);

            // Voit ohjata käyttäjän takaisin kirjautumissivulle tai muihin tarvittaviin sivuihin
            navigate('/login');
        } catch (error) {
            console.error("Password update failed.", error);
            window.alert("Password update failed.");
        }
    }

    return (
        <div className="passwordBody">
            <form className="passwordForm" onSubmit={onUpdatePasswordClicked}>
                <h1>Enter new password</h1>
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