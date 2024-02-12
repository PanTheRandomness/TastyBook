import { NavLink, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {Register} from './pages/Register';
import {Login} from './pages/LoginPage';
import {Logout} from './pages/LogoutPage';
import Admin from './pages/Admin';
import {AdminRegister} from './pages/AdminRegister';
import FrontPage from "./pages/FrontPage";
import { Recipe } from './pages/RecipePage';
import { AddRecipe } from './pages/AddRecipePage';
import { useToken } from "./customHooks/useToken";
import { useEffect, useState } from "react";
import { getRecipeRoutes } from "./api/recipeApi";
import "./Styles/NavBar.css";
import { useUser } from "./customHooks/useUser";

const App = () => {
  const user = useUser();
  const [token, setToken] = useToken();
  const [recipeRoutes, setRecipeRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getRecipeRoutes(token);
        setRecipeRoutes(response.hashes);
        if (!response.loggedIn) onLogout();
      } catch (error) {
        // TODO: show error
      }
    }

    fetchRoutes();
    // onLogout won't change over time, the following comment disables the linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addRecipeRoute = (route) => {
    setRecipeRoutes([...recipeRoutes, { hash: route }]);
  }

  const onLogin = (token) => {
    setToken(token);
  }

  const onLogout = () => {
    localStorage.removeItem(token);
    setToken("");
  }

  return (
    <Router>
      <nav>
            <div>
                <NavLink className={"navLink"} to={"/"}>Tasty Book</NavLink>
            </div>
            <div>
                <NavLink className={"navLink"} to={"/"}>Recipes</NavLink>
            </div>
            {
                (user && token) ?
                <>
                <div>
                    <NavLink className={"navLink"} to={"/newrecipe"}>Add Recipe</NavLink>
                </div>
                <div>
                    <NavLink className={"navLink"} to={"/"} onClick={onLogout}>Logout</NavLink>
                </div>
                </> :
                <div>
                    <NavLink className={"navLink"} to={"/register"}>Register</NavLink>
                    <NavLink className={"navLink"} to={"/login"}>Login</NavLink>
                </div>
            }
        </nav>

      <Routes>
        <Route path='/' element={<FrontPage />}></Route>
        <Route path='/register' element={<Register onLogin={onLogin} />}></Route>
        <Route path='/login' element={<Login onLogin={onLogin} />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/adminregister' element={<AdminRegister onLogin={onLogin} />}></Route>
        <Route path='/recipe' element={<Recipe />}></Route>
        <Route path='/newrecipe' element={<AddRecipe addRecipeRoute={addRecipeRoute} />}></Route>

        {
          recipeRoutes.map((route) => (
            <Route key={route.id} path={`/recipe/${route.hash}`} element={<Recipe route={route.hash} />}></Route>
          ))
        }
      </Routes>
    </Router>
  );
}

export default App;
