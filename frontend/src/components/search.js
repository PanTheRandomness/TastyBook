import React, { useState, useEffect } from 'react';
import { fetchRecipe } from '../api/recipeApi';

const Search = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetchRecipe(token, searchTerm); 
        setSearchResults(response);
        if (response.length === 0) {
          setError('No recipes found.');
        } else {
          setError('');
        }
      } catch (error) {
        console.error('Error searching recipes:', error);
        setError('Error searching recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (searchTerm) { 
      getRecipe();
    }
  }, [token, searchTerm]); 

  const handleSearch = (e) => {
    e.preventDefault(); 
    setSearchResults([]); 
    setSearchTerm(e.target.value); 
  };

  return (
    <div>
      <h2>Recipe Search</h2>
      <form onSubmit={handleSearch}>
        <label>
          Search by name or ingredients:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && (
        <div className="error-message">{error}</div>
      )}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((recipe, index) => (
              <li key={index}>
                <h4>{recipe.header}</h4>
                <p>{recipe.ingredients}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchResults.length === 0 && !loading && (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default Search;
