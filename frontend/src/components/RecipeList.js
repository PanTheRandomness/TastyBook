import React, { useState, useEffect } from 'react';
import { useToken } from "../customHooks/useToken";
import "../Styles/RecipeViewPage.css";
import RecipeView from "../components/recipeView";
import { getFavourites } from '../api/favouriteApi';

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
  }, [token]); 

  return (
    <div>
      <h1 className="pageheader">My Favourites:</h1>
      <div className="recipeViewContainer">
        {favouriteRecipes.length > 0 ? (
          favouriteRecipes.map(recipe => (
            <RecipeView key={recipe.id} recipe={recipe} />
          ))
        ) : <div>No favourite recipes found.</div>}
      </div>
    </div>
  );
};

export default RecipeList;
