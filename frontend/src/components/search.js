import React, { useState, useEffect } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:3004/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          throw new Error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);

  // Haku 
  const handleSearch = () => {
    const filteredRecipes = recipes.filter(
      recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedRecipes = filteredRecipes.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });

    setRecipes(sortedRecipes);
  };

  // Suosikki, tehtiinkö se tähän? 
  const addFavoriteRecipe = (recipeId) => {
    const favoriteRecipe = recipes.find(recipe => recipe.id === recipeId);
    if (favoriteRecipe) {
      setFavoriteRecipes([...favoriteRecipes, favoriteRecipe]);
    }
  };

  return (
    <div>
      <h2>Recipe Search</h2>
      <label>
        Search by name or author:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Search</button>

      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <strong>{recipe.name}</strong> by {recipe.author}
            <button onClick={() => addFavoriteRecipe(recipe.id)}>Add to Favorites</button>
          </li>
        ))}
      </ul>

      <h2>Favorite Recipes </h2>
      <ul>
        {favoriteRecipes.map(recipe => (
          <li key={recipe.id}>
            <strong>{recipe.name}</strong> by {recipe.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
