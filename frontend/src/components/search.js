import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Search.css'; 
import { useToken } from '../customHooks/useToken';


const BASE_URL = 'http://localhost:3004/api/recipes';

const searchRecipes = async (keyword, ingredient, loggedIn) => {
  console.log("Search term:", keyword);
  console.log("Ingredient:", ingredient);
  console.log("Logged in:", loggedIn);

  let url = `${BASE_URL}?`;

  if (keyword) {
    url += `name=${encodeURIComponent(keyword)}`;
  }

  if (ingredient) {
    if (url.includes('?')) {
      url += `&ingredient=${encodeURIComponent(ingredient)}`;
    } else {
      url += `ingredient=${encodeURIComponent(ingredient)}`;
    }
  }

  if (!loggedIn) {
    if (url.includes('?')) {
      url += `&visibleToAll=true`;
    } else {
      url += `visibleToAll=true`;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    throw new Error('Error searching recipes: ' + error.message);
  }
};




const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [token] = useToken();


  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      try {
        const recipes = await searchRecipes(searchTerm, '', loggedIn);
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

    if (searchTerm) {
      getRecipes();
    }
  }, [searchTerm, loggedIn]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([]);
    setLoading(true);
    try {
      const recipes = await searchRecipes(searchTerm, '', loggedIn);
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
      <label htmlFor="searchInput">Search by name or ingredient:</label>
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
