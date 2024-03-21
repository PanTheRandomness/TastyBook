import React, { useState, useEffect } from 'react';
import { useUser } from '../customHooks/useUser';
import '../Styles/RecipeView.css';
import RecipeView from "../components/recipeView";
import { NavLink } from "react-router-dom";

const BASE_URL = 'http://localhost:3004/api/recipes';


const RecipeList = () => {
  const user = useUser();
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        if (!user || !user.username) {
          throw new Error('Username not available');
        }

        const response = await fetch(`${BASE_URL}?username=${user.username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user recipes');
        }
        const data = await response.json();
        setMyRecipes(data.recipes);
      } catch (error) {
        setError('Error fetching user recipes');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.username) {
      fetchMyRecipes();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recipe-list-container">
      <h2>My Recipes</h2>
      {myRecipes.length > 0 ? (
        <ul className='recipeViewContainer'>
          {myRecipes.map((recipe, index) => (
            <div key={index}>
              <NavLink className={"recipeView"} to={`/recipe/${recipe.hash}`}>
                <RecipeView key={recipe.id} recipe={recipe} />
              </NavLink>
            </div>
          ))}
        </ul>
      ) : (
        <div>No recipes found.</div>
      )}
    </div>
  );
};

export default RecipeList;
