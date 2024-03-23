import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {Register} from './pages/Register';
import {Login} from './pages/LoginPage';
import {NewPassword} from './pages/NewPassword';
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
import Search from "./components/search";
import NotFound from "./pages/NotFoundPage";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import RecipeList from "./components/RecipeList";
import './Styles/fonts.css';
import NavigationBar from "./components/NavigationBar";
import MyRecipes from "./pages/MyRecipes";

const App = () => {
  const { user, login } = useUser();
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
    login(token);
  }

  const onLogout = () => {
    setToken("");
    login("");
  }

  if (!loading && errorMessage) return <p>{errorMessage}</p>

  return (
    <Router>
      <NavigationBar key={token} onLogout={onLogout} />
      <div className="separator"></div>
      
      <Routes>
        <Route path='/' element={<FrontPage key={token} onLogout={onLogout} />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login onLogin={onLogin} />}></Route>
        <Route path='/newpassword/:verificationString' element={<NewPassword />}></Route>
        { user && user.role === 'admin' && <Route path='/admin' element={<Admin />}></Route> }
        <Route path='/adminregister' element={<AdminRegister />}></Route>
        { user && <Route path='/newrecipe' element={<AddRecipe addRecipeRoute={addRecipeRoute} />}></Route> }

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

        <Route path='/verify-email/:verificationString' element={<EmailVerification />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/search' element={<Search />} />
        <Route path="/search/:keyword" element={<Search />} />
        {
          user && 
          <>
            <Route path='/recipeList' element={<RecipeList />} />
            <Route path='/myrecipes' element={<MyRecipes />} />
          </>
        }
        <Route path='/*' element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
