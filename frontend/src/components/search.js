import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Search.css';

const BASE_URL = 'http://localhost:3004/api/recipes';

const searchKeyword = async (keyword) => {
  let url = `${BASE_URL}?`;

  if (keyword) {
    url += `keyword=${keyword}`;
  } 

  console.log('Search URL:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    const data = await response.json();
    console.log('Search results:', data);
    return data.recipes || [];
  } catch (error) {
    throw new Error('Error searching recipes: ' + error.message);
  }
};

const searchIngredient = async (ingredient) => {
  let url = `${BASE_URL}?`;

  if (ingredient) {
    url += `&ingredient=${ingredient}`;
  }

  console.log('Search URL:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    const data = await response.json();
    console.log('Search results:', data);
    return data.recipes || [];
  } catch (error) {
    throw new Error('Error searching recipes: ' + error.message);
  }
};


const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([]);
    setLoading(true);
    try {
      const keywordRecipes = await searchKeyword(searchTerm);
      const ingredientRecipes = await searchIngredient(searchTerm);
      const recipes = [...keywordRecipes, ...ingredientRecipes];
      setSearchResults(recipes);
      if (recipes.length === 0 && searchTerm !== '') {
        setError('No recipes found.');
      } else {
        setError('');
      }
    } catch (error) {
      setError('Error searching recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Recipe Search</h2>
      <label htmlFor="searchInput">Search by keyword or ingredient:</label>
      <input
        id="searchInput"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul className="searchViewContainer">
            {searchResults.map((recipe, index) => (
              <li key={index}>
                <Link to={`/recipe/${recipe.hash}`}>
                  <p>id: {recipe.id}, header: "{recipe.header}", username: "{recipe.username}", hash: "{recipe.hash}", average_rating: {recipe.average_rating}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
