import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

const BASE_URL = 'http://localhost:3004/api/recipes';

const RecipeList = ({ currentUsername }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await fetch(`${BASE_URL}?username=${currentUsername}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user recipes');
        }
        const data = await response.json();
        if (data.recipes.length === 0) {
          setError('No recipes found.');
        } else {
          setUserRecipes(data.recipes);
          setError('');
        }
      } catch (error) {
        setError('Error fetching user recipes.');
      }
    };
  
    if (currentUsername) {
      fetchUserRecipes();
    }
  }, [currentUsername]);
  

  const handleSortByName = () => {
    const sorted = [...userRecipes].sort((a, b) => a.name.localeCompare(b.name));
    setUserRecipes(sorted);
  };

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
