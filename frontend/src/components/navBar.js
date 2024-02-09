import { NavLink } from "react-router-dom";
import { useUser } from "../customHooks/useUser";
import "../Styles/NavBar.css";

const NavigationBar = ({ user }) => {
    return (
        <nav>
            <NavLink className={"navLink"} to={"/"}>Front Page</NavLink>

            {
                user ?
                <NavLink className={"navLink"} to={"/"}>Tähän jotakin?</NavLink> :
                <>
                <NavLink className={"navLink"} to={"/register"}>Register</NavLink>
                <NavLink className={"navLink"} to={"/login"}>Login</NavLink>
                </> 
            }
        </nav>
    );
}

export default NavigationBar;