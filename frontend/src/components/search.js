import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Search.css';
import '../Styles/RecipeView.css';
import RecipeView from "../components/recipeView";

const BASE_URL = 'http://localhost:3004/api/recipes';

const searchRecipes = async (params) => {
  let url = `${BASE_URL}?`;

  Object.keys(params).forEach(key => {
    if (params[key]) {
      url += `${key}=${params[key]}&`;
    }
  });

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
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    ingredient: '',
    username: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTabs, setActiveTabs] = useState([]);

  const handleSearch = async () => {
    setSearchResults([]);
    setLoading(true);
    try {
      const recipes = await searchRecipes(searchParams);
      setSearchResults(recipes);
      setError(recipes.length === 0 ? 'No recipes found.' : '');
    } catch (error) {
      setError('Error searching recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTabs(activeTabs.includes(tabName) ? activeTabs.filter(tab => tab !== tabName) : [...activeTabs, tabName]);
    setSearchParams({
      ...searchParams,
      [tabName]: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  return (
    <div>
      <h2>Recipe Search</h2>
      <div>
        <button onClick={() => handleTabClick('keyword')}>Search by keyword</button>
        <button onClick={() => handleTabClick('ingredient')}>Search by ingredient</button>
        <button onClick={() => handleTabClick('username')}>Search by username</button>
      </div>
      {activeTabs.includes('keyword') && (
        <div>
          <label htmlFor="keywordInput">Keyword:  </label>
          <input
            id="keywordInput"
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleInputChange}
          />
        </div>
      )}
      {activeTabs.includes('ingredient') && (
        <div>
          <label htmlFor="ingredientInput">Ingredient:  </label>
          <input
            id="ingredientInput"
            type="text"
            name="ingredient"
            value={searchParams.ingredient}
            onChange={handleInputChange}
          />
        </div>
      )}
      {activeTabs.includes('username') && (
        <div>
          <label htmlFor="usernameInput">Username:  </label>
          <input
            id="usernameInput"
            type="text"
            name="username"
            value={searchParams.username}
            onChange={handleInputChange}
          />
        </div>
      )}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul className='recipeViewContainer'>
            {searchResults.map((recipe, index) => (
              <div  key={index}>
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
