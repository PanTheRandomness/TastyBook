import { NavLink, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {Register} from './pages/Register';
import {Login} from './pages/LoginPage';
import {Logout} from './pages/LogoutPage';
import Admin from './pages/Admin';
import FrontPage from "./pages/FrontPage";
import { Recipe } from './pages/RecipePage';
import { AddRecipe } from './pages/AddRecipePage';
import { useToken } from "./customHooks/useToken";

const App = () => {
  const [, setToken] = useToken();

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
        <Route path='/recipe' element={<Recipe />}></Route>
        <Route path='/newrecipe' element={<AddRecipe />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
