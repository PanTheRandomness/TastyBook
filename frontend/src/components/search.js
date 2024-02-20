import React, { useState, useEffect } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Uusi tilamuuttuja

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:3004/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
          setFilteredRecipes(data); // Alustetaan suodatetut reseptit alkuperäisillä resepteillä
        } else {
          window.alert('Failed to fetch recipes');
        }
      } catch (error) {
        console.error(error);
        window.alert('An error occurred while fetching recipes');
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = () => {
    if (recipes.length > 0) {
      const filteredRecipes = recipes.filter(
        recipe =>
          recipe.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      const sortedRecipes = filteredRecipes.sort((a, b) => {
        if (a.header.toLowerCase() < b.header.toLowerCase()) return -1;
        if (a.header.toLowerCase() > b.header.toLowerCase()) return 1;
        return 0;
      });
  
      setFilteredRecipes(sortedRecipes); 
    } else {
      window.alert('No recipes available to search'); 
    }
  };
  


  return (
    <div>
      <h2>Recipe Search</h2>
      <label>
        Search by name or ingredients:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
