import { useEffect, useState } from 'react';
import { useUser } from '../customHooks/useUser'; 
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:3004/api/recipes';

const RecipeList = () => {
  const user = useUser(); 
  const [userRecipes, setUserRecipes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Lisätty loading-tila

  const fetchUserRecipes = async () => {
    try {
      if (user && user.loggedIn) { 
        console.log('Fetching user recipes...');
        const response = await fetch(`${BASE_URL}?username=${user.username}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user recipes');
        }
        const data = await response.json();
        console.log('Fetched recipes:', data.recipes);
        setUserRecipes(data.recipes);
        setError('');
      } else {
        setError('User not logged in.');
        setUserRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error fetching recipes.');
      setUserRecipes([]);
    } finally {
      setLoading(false); // Merkitään lataus valmiiksi, kun haku on suoritettu
    }
  };

  useEffect(() => {
    if (user && user.loggedIn) {
      fetchUserRecipes();
    }
  }, [user]);

  const handleSortByName = () => {
    const sorted = [...userRecipes].sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });
    setUserRecipes(sorted);
  };

  if (loading) {
    return <div>Loading...</div>; // Näytä latausviesti, kun käyttäjäobjektia haetaan
  }

  return (
    <div>
      <h2>Your Recipes</h2>
      <button onClick={handleSortByName}>Sort by Name</button>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {userRecipes.map((recipe, index) => (
          <li key={index}>
            <Link to={`/recipe/${recipe.hash}`}>
              <p>Header: "{recipe.header}"</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
