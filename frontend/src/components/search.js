import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Search.css';
import RecipeView from "../components/recipeView";

const BASE_URL = 'http://localhost:3004/api/recipes';

const searchByKeyword = async (keyword) => {
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

const searchByIngredient = async (ingredient) => {
  let url = `${BASE_URL}?`;

  if (ingredient) {
    url += `ingredient=${ingredient}`;
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

const searchByUsername = async (username) => {
  let url = `${BASE_URL}?`;

  if (username) {
    url += `username=${username}`;
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
  const [keyword, setKeyword] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(null);

  const handleSearch = async () => {
    setSearchResults([]);
    setLoading(true);
    try {
      let recipes = [];
      if (activeTab === 'keyword') {
        recipes = await searchByKeyword(keyword);
      } else if (activeTab === 'ingredient') {
        recipes = await searchByIngredient(ingredient);
      } else if (activeTab === 'username') {
        recipes = await searchByUsername(username);
      }

      setSearchResults(recipes);
      setError(recipes.length === 0 && activeTab ? 'No recipes found.' : '');
    } catch (error) {
      setError('Error searching recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Recipe Search</h2>
      <div>
        <button onClick={() => setActiveTab('keyword')}>Search by keyword</button>
        <button onClick={() => setActiveTab('ingredient')}>Search by ingredient</button>
        <button onClick={() => setActiveTab('username')}>Search by username</button>
      </div>
      {activeTab && (
        <div>
          <label htmlFor="searchInput">Enter {activeTab === 'keyword' ? 'keyword' : activeTab === 'ingredient' ? 'ingredient' : 'username'}:</label>
          <input
            id="searchInput"
            type="text"
            value={activeTab === 'keyword' ? keyword : activeTab === 'ingredient' ? ingredient : username}
            onChange={(e) => {
              if (activeTab === 'keyword') setKeyword(e.target.value);
              else if (activeTab === 'ingredient') setIngredient(e.target.value);
              else setUsername(e.target.value);
            }}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul className="searchViewContainer">
          {searchResults.map((recipe, index) => (
          <div key={index}>
            <Link to={`/recipe/${recipe.hash}`}>
              <RecipeView key={recipe.id} recipe={recipe} />
            </Link>
          </div>
           ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
