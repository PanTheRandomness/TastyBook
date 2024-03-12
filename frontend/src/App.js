import { NavLink, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {Register} from './pages/Register';
import {Login} from './pages/LoginPage';
import {NewPassword} from './pages/NewPassword';
import Admin from './pages/Admin';
import Print from './components/Print';
import {AdminRegister} from './pages/AdminRegister';
import FrontPage from "./pages/FrontPage";
import { Recipe } from './pages/RecipePage';
import { AddRecipe } from './pages/AddRecipePage';
import { useToken } from "./customHooks/useToken";
import { useEffect, useState } from "react";
import { getRecipeRoutes } from "./api/recipeApi";
import "./Styles/NavBar.css";
import { useUser } from "./customHooks/useUser";
import Search from "./components/search";
import NotFound from "./pages/NotFoundPage";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  const user = useUser();
  const [token, setToken] = useToken();
  const [recipeRoutes, setRecipeRoutes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getRecipeRoutes(token);
        if (!Array.isArray(response.hashes)) throw new Error();
        setRecipeRoutes(response.hashes);
        setErrorMessage("");
        if (!response.loggedIn) onLogout();
      } catch (error) {
        setErrorMessage("Error loading recipe routes");
      } finally {
        setLoading(false);
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
    setToken("");
  }

  //reseptin haku tulostusta varten
  const getRecipeByHash = (hash) => {
    const foundRecipe = recipeRoutes.find((route) => route.hash === hash);
    return foundRecipe || null;
  };

  if (!loading && errorMessage) return <p>{errorMessage}</p>

  return (
    <Router>
      <nav>
        <div>
          <NavLink className={"navLink"} to={"/"}>Tasty Book</NavLink>
        </div>
        {
          (user && token) ?
            <>
              <div>
                <NavLink className={"navLink"} to={"/newrecipe"}>Add Recipe</NavLink>
              </div>
              <div>
                { user.role === "admin" && <NavLink className={"navLink"} to={"/admin"}>Admin</NavLink> }
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
        <Route path='/' element={<FrontPage onLogout={onLogout} />}></Route>
        <Route path='/register' element={<Register onLogin={onLogin} />}></Route>
        <Route path='/login' element={<Login onLogin={onLogin} />}></Route>
        <Route path='/newpassword/:verificationString' element={<NewPassword />}></Route>
        { user && user.role === 'admin' && <Route path='/admin' element={<Admin />}></Route> }
        <Route path='/adminregister' element={<AdminRegister onLogin={onLogin} />}></Route>
        { (user && token) && <Route path='/newrecipe' element={<AddRecipe addRecipeRoute={addRecipeRoute} />}></Route> }

        {
          recipeRoutes.map((route) => (
            <Route key={route.hash} path={`/editrecipe/${route.hash}`} element={<AddRecipe route={route.hash} />}></Route>
          ))
        }
        
        {
          recipeRoutes.map((route) => (
            <Route key={route.hash} path={`/recipe/${route.hash}`} element={<Recipe route={route.hash} />}></Route>
          ))
        }
        
        {/*Reititys reseptin tulostukseen */}
        {recipeRoutes.map((route) => (
        <Route
          key={route.hash}
          path={`/print/${route.hash}`}
          element={<Print recipe={getRecipeByHash(route.hash)} />}
        ></Route>
      ))}

        <Route path='/verify-email/:verificationString' element={<EmailVerification />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/search' element={<Search />} />
        <Route path='/*' element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
