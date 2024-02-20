import React, { useState} from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes] = useState([]);

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
