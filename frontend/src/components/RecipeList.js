import React, { useState, useEffect } from 'react';
import { useUser } from '../customHooks/useUser';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:3004/api/recipes';

const RecipeList = () => {
  const user = useUser(); // Hae käyttäjän tiedot, mukaan lukien käyttäjän ID
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('User ID not available');
        }

        const response = await fetch(`${BASE_URL}/favorites/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorite recipes');
        }
        const data = await response.json();
        setRecipes(data.recipes);
        setLoading(false);
      } catch (error) {
        setError('Error fetching favorite recipes');
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [user]); // Ajetaan uudelleen aina kun käyttäjä muuttuu

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recipe-list-container">
      <h2>Favorite Recipes</h2>
      {recipes.length > 0 ? (
        <ul className="recipe-list">
          {recipes.map(recipe => (
            <li key={recipe.id} className="recipe-item">
              <Link to={`/recipes/${recipe.id}`}>
                <div className="recipe-title">{recipe.title}</div>
                <div className="recipe-description">{recipe.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>No favorite recipes found.</div>
      )}
    </div>
  );
};

export default RecipeList;
