import { useUser } from "../customHooks/useUser";
import { NavLink } from "react-router-dom";

const NavigationBar = ({ onLogout }) => {
    const { user } = useUser();
    return (
        <nav>
            <div>
                <NavLink data-testid="logo" className={"navLink"} to={"/"}><img src='/book.png' alt="Logo" height={80} width={80} /><img src='/text.png' alt="Logo" height={60} width={300} /></NavLink>
            </div>
            {user ?
                <>
                    <div>
                        <NavLink className={"navLink"} to={"/newrecipe"} data-testid="addrecipeNav">Add Recipe</NavLink>
                        <NavLink className={"navLink"} to={"/myrecipes"}>My Recipes</NavLink>
                        <NavLink className={"navLink"} to={"/recipelist"}>Favourites</NavLink>
                    </div>
                    <div>
                        <NavLink className={"navLink"} to={"/search"}>Search</NavLink>
                        {user.role === "admin" && <NavLink className={"navLink"} to={"/admin"}>Admin</NavLink>}
                        <NavLink className={"navLink"} to={"/"} onClick={() => onLogout()}>Logout</NavLink>
                    </div>
                </> :
                <div>
                    <NavLink className={"navLink"} to={"/search"}>Search</NavLink>
                    <NavLink className={"navLink"} to={"/register"}>Register</NavLink>
                    <NavLink className={"navLink"} to={"/login"} data-testid="loginNav">Login</NavLink>
                </div>
            }
        </nav>
    )
}

export default NavigationBar;