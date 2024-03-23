import React, { useState, useEffect } from 'react';
import { useToken } from "../customHooks/useToken";
import '../Styles/RecipeView.css';
import RecipeView from "../components/recipeView";
import { NavLink } from "react-router-dom";
import { getFavourites } from '../api/favouriteApi';

const BASE_URL = 'http://localhost:3004/api/recipes';

const RecipeList = () => {
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token] = useToken();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        if (token) {
          console.log('Fetching favorites...');
          const favourites = await getFavourites(token);
          console.log('Favorites:', favourites);
          setFavouriteRecipes(favourites);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error.message);
        setError('Error fetching favorites');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      console.log('User token:', token);
      fetchFavourites();
    } else {
      setLoading(false);
    }
  }, [token]); // Lisätään token riippuvuuslistaan

  return (
    <div className="recipe-list-container">
      <h2>My Favourite Recipes</h2>
      {favouriteRecipes.length > 0 ? (
        <ul className='recipeViewContainer'>
          {favouriteRecipes.map((recipe, index) => (
            <div key={index}>
              <NavLink className={"recipeView"} to={`/recipe/${recipe.hash}`}>
                <RecipeView key={recipe.id} recipe={recipe} />
              </NavLink>
            </div>
          ))}
        </ul>
      ) : (
        <div>No favourite recipes found.</div>
      )}
    </div>
  );
};

export default RecipeList;
