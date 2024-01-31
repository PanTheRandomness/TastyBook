import { NavLink, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {Register} from './pages/Register';
import Admin from './pages/Admin';
import FrontPage from "./pages/FrontPage";
import { Recipe } from './pages/RecipePage';
import { AddRecipe } from './pages/AddRecipePage';

const App = () => {
  return (
    <Router>
      { /* Tähän joku navigointi bar? */}
      <Routes>
      { /* Tähän lisätään eri reittejä */}
        <Route path='/' element={<FrontPage />}></Route>
        <Route path='/signup' element={<Register />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/recipe' element={<Recipe />}></Route>
        <Route path='/newrecipe' element={<AddRecipe />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
