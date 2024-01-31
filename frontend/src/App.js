import { NavLink, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import {Register} from './pages/Register';
import FrontPage from "./pages/FrontPage";

const App = () => {
  return (
    <Router>
      { /* Tähän joku navigointi bar? */}
      <Routes>
      { /* Tähän lisätään eri reittejä */}
        <Route path='/' element={<FrontPage />}></Route>
        <Route path='/signup' element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
