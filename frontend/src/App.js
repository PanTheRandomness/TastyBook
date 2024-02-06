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

const App = () => {
  const [token, setToken] = useToken();
  const [recipeRoutes, setRecipeRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getRecipeRoutes(token);
        setRecipeRoutes(response);
      } catch (error) {
        // TODO: show error
      }
    }

    fetchRoutes();
  }, []);

  const addRecipeRoute = (route) => {
    setRecipeRoutes([...recipeRoutes, { hash: route }]);
  }

  const onLogin = (token) => {
    setToken(token);
  }
/*Tämän kutsu sitten sieltä mistä kirjaudutaan ulos
  const onLogout = () => {
    localStorage.removeItem(token);
    setToken("");
  }
*/
  return (
    <Router>
      { /* Tähän joku navigointi bar? */}
      <nav>
        <NavLink to={"/register"}>Register</NavLink>
        <NavLink to={"/login"}>Login</NavLink>
      </nav>
      <Routes>
      { /* Tähän lisätään eri reittejä */}
        <Route path='/' element={<FrontPage />}></Route>
        <Route path='/register' element={<Register onLogin={onLogin} />}></Route>
        <Route path='/login' element={<Login onLogin={onLogin} />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/adminregister' element={<AdminRegister />}></Route>
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
