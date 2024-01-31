import React, { useState, useEffect } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {


    const fetchRecipes = async () => {  // Tee tähän http pyyntö
      try {
        const response = await fetch('/api/recipes'); //Polku
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes', error);
      }
    };

    fetchRecipes();
  }, []);

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
