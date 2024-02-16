import React, { useState, useEffect } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(()=>{
    const getRecipe = async () =>{
        try {
            const response = await fetch("http://localhost:3004/api/recipe/" + route);
            if (response.ok) {
                const r = await response.json();
                setRecipe(r);
            } else {
                throw new Error('Recipe not found');
            }
        } catch (error) {
            window.alert("An error occurred while loading recipe: " + error);
        }
    }
    getRecipe();
},[route]);

  const handleSearch = () => {
    const filteredRecipes = recipes.filter(
      recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedRecipes = filteredRecipes.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

      if (a.author.toLowerCase() < b.author.toLowerCase()) return -1;
      if (a.author.toLowerCase() > b.author.toLowerCase()) return 1;

      return 0;
    });

    setRecipes(sortedRecipes);
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
