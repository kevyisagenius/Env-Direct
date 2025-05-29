import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext.jsx'; // No longer directly import AuthContext
import { useAuth } from '../context/AuthContext.jsx'; // Import the custom hook
import authService from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL;

const SubmitArticlePage = () => {
  // const { currentUser } = useContext(AuthContext); // Old way
  const { currentUser } = useAuth(); // New way: use the custom hook
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login?message=Please login to submit an article');
    }

    // Fetch categories and tags
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoriesResponse = await fetch(`${API_URL}/api/categories`);
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const tagsResponse = await fetch(`${API_URL}/api/tags`);
        if (!tagsResponse.ok) throw new Error('Failed to fetch tags');
        const tagsData = await tagsResponse.json();
        setTags(tagsData);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching categories/tags:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
        fetchData();
    }
  }, [currentUser, navigate]);

  const handleTagChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedTags(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsLoading(true);

    if (!title.trim() || !content.trim() || !selectedCategory) {
      setError('Title, content, and category are required.');
      setIsLoading(false);
      return;
    }

    const articleData = {
      title,
      content,
      categoryName: selectedCategory, // Assuming backend expects category name
      tagNames: selectedTags,       // Assuming backend expects array of tag names
      // Backend will set authorId based on JWT and status to PENDING_APPROVAL
    };

    try {
      const token = authService.getCurrentUserToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/articles/submit`, { // New endpoint for Junie
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred during submission.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // const result = await response.json(); // Or handle success without specific result data
      setSuccessMessage('Your article has been submitted for review. Thank you!');
      setTitle('');
      setContent('');
      setSelectedCategory('');
      setSelectedTags([]);
      // Optionally redirect or clear form
      // navigate('/green-atlas-magazine');

    } catch (err) {
      setError(err.message);
      console.error('Failed to submit article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="container mx-auto p-4">Redirecting to login...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 pt-20 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Submit Your Article</h1>
      
      {successMessage && (
        <div className="mb-4 p-3 text-center bg-green-100 text-green-700 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 text-center bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Article Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Article Content
          </label>
          <textarea
            name="content"
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Write your article here... Markdown is supported by default on display."
          />
           <p className="mt-2 text-xs text-gray-500">
            Basic Markdown will be rendered. For complex formatting, use simple text.
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (Ctrl/Cmd + click to select multiple)
          </label>
          <select
            multiple
            name="tags"
            id="tags"
            value={selectedTags}
            onChange={handleTagChange}
            className="mt-1 block w-full px-3 py-2 h-32 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
        
        {/* Placeholder for image upload - to be implemented later if needed */}
        {/*
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Cover Image (Optional)
          </label>
          <input
            type="file"
            name="image"
            id="image"
            // onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
        */}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Article for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitArticlePage; 