import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Placeholder for a single article page/route later
// import { Link } from 'react-router-dom';

const GreenAtlasMagazinePage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [effectiveSearchTerm, setEffectiveSearchTerm] = useState(''); // To trigger fetch on button click or debounce
  const [currentPage, setCurrentPage] = useState(0); // Page is 0-indexed in Spring Data
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Category and Tag filter state
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  // Unified loading/error state for filters for simplicity, can be split if needed
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersError, setFiltersError] = useState(null);

  // Sorting state
  const defaultSort = 'createdAt,desc';
  const [sortOption, setSortOption] = useState(defaultSort);

  const sortOptions = [
    { value: 'createdAt,desc', label: 'Most Recent' },
    { value: 'createdAt,asc', label: 'Oldest' },
    { value: 'title,asc', label: 'Title A-Z' },
    { value: 'title,desc', label: 'Title Z-A' },
  ];

  const articlesPerPage = 6; // Or your desired default

  // Debounce function (optional, for searching as user types)
  // const debounce = (func, delay) => {
  //   let timeoutId;
  //   return (...args) => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => func.apply(this, args), delay);
  //   };
  // };

  const fetchFiltersData = useCallback(async () => {
    setFiltersLoading(true);
    setFiltersError(null);
    try {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tags')
      ]);
      const categoriesData = await categoriesResponse.json();
      const tagsData = await tagsResponse.json();

      if (!categoriesResponse.ok) throw new Error(categoriesData.message || 'Failed to fetch categories');
      if (!tagsResponse.ok) throw new Error(tagsData.message || 'Failed to fetch tags');
      
      setCategories(categoriesData || []);
      setTags(tagsData || []);
    } catch (err) {
      console.error("Error fetching filters data:", err);
      setFiltersError(err.message);
      setCategories([]); // Clear on error to prevent issues with .map
      setTags([]);       // Clear on error
    }
    setFiltersLoading(false);
  }, []);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let url = `/api/articles?page=${currentPage}&size=${articlesPerPage}&sort=${sortOption}`;
    if (effectiveSearchTerm) url += `&search=${encodeURIComponent(effectiveSearchTerm)}`;
    // Send categoryName and tagName if they are selected (not empty string)
    if (selectedCategory) url += `&categoryName=${encodeURIComponent(selectedCategory)}`;
    if (selectedTag) url += `&tagName=${encodeURIComponent(selectedTag)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0); // Extract total elements from response

      // Log pagination info for debugging
      console.log(`Page ${currentPage + 1} of ${data.totalPages}, Total articles: ${data.totalElements}`);
    } catch (e) {
      console.error("Failed to fetch articles:", e);
      setError(e.message);
      setArticles([]); 
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveSearchTerm, currentPage, sortOption, articlesPerPage, selectedCategory, selectedTag]);

  useEffect(() => {
    fetchFiltersData(); 
  }, [fetchFiltersData]);

  useEffect(() => {
    // Only fetch articles if filters are not loading, to prevent race conditions
    // or fetching with incomplete filter data, though backend should handle empty params.
    if (!filtersLoading) {
        fetchArticles(); 
    }
  }, [fetchArticles, filtersLoading]); // Add filtersLoading as a dependency
  
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSearchSubmit = () => {
    setCurrentPage(0);
    setEffectiveSearchTerm(searchTerm);
  };
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
    setEffectiveSearchTerm('');
  };
  const handleSortChange = (event) => {
    setCurrentPage(0);
    setSortOption(event.target.value);
  };
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCurrentPage(0);
    setSelectedCategory(newCategory);
    // Decide if selecting a category should clear the tag filter or allow combined filtering
    // setSelectedTag(''); // Option 1: Clear tag filter
  };
  const handleTagChange = (event) => {
    const newTag = event.target.value;
    setCurrentPage(0);
    setSelectedTag(newTag);
    // Decide if selecting a tag should clear the category filter or allow combined filtering
    // setSelectedCategory(''); // Option 1: Clear category filter
  };
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));

  if (isLoading) {
    return <div className="p-8 text-center"><p>Loading articles...</p></div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600"><p>Error loading articles: {error}</p></div>;
  }

  if (articles.length === 0) {
    return <div className="p-8 text-center"><p>{effectiveSearchTerm ? `No articles found for "${effectiveSearchTerm}".` : "No articles found at the moment. Check back soon!"}</p></div>;
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">GREEN ATLAS MAGAZINE</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Explore insightful articles, research, and stories on environmental conservation, climate change, and sustainable practices. Our magazine aims to inspire action and awareness.</p>

      {/* Filters and Controls Bar */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="flex flex-col">
            <label htmlFor="search" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Search Articles</label>
            <div className="flex">
              <input 
                type="text" 
                id="search"
                placeholder="Keywords..." 
                value={searchTerm} 
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-gray-200" 
              />
              <button 
                onClick={handleSearchSubmit} 
                className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 whitespace-nowrap shadow-sm"
              >
                Search
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label htmlFor="categoryFilter" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</label>
            <select 
              id="categoryFilter" 
              value={selectedCategory} 
              onChange={handleCategoryChange} 
              disabled={filtersLoading || categories.length === 0} // Disable if loading or no categories
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-gray-200 disabled:opacity-50"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id || category.name} value={category.name}>{category.name}</option> 
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-col">
            <label htmlFor="tagFilter" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Tag</label>
            <select 
              id="tagFilter" 
              value={selectedTag} 
              onChange={handleTagChange} 
              disabled={filtersLoading || tags.length === 0} // Disable if loading or no tags
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-gray-200 disabled:opacity-50"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id || tag.name} value={tag.name}>{tag.name}</option> 
              ))}
            </select>
          </div>
          
          {/* Sort Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="sortOptions" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
            <select 
              id="sortOptions" 
              value={sortOption} 
              onChange={handleSortChange} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-gray-200"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        {(effectiveSearchTerm || selectedCategory || selectedTag) && (
            <button 
                onClick={() => {
                    handleClearSearch();
                    setSelectedCategory('');
                    setSelectedTag('');
                    // fetchArticles will be triggered by state changes
                }}
                className="mt-4 px-3 py-1.5 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 whitespace-nowrap shadow-sm"
            >
                Clear All Filters & Search
            </button>
        )}
        {filtersError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Error loading filters: {filtersError}. Please try refreshing.</p>}
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center"><p>Loading articles...</p></div>
      ) : error ? (
        <div className="p-8 text-center text-red-600"><p>Error: {error}</p></div> // Display the actual error message
      ) : articles.length === 0 ? (
        <div className="p-8 text-center"><p>{effectiveSearchTerm || selectedCategory || selectedTag ? "No articles found matching your criteria." : "No articles published yet. Check back soon!"}</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out flex flex-col">
              {article.imageUrl && (
                <Link to={`/magazine/article/${article.id}`} className="block mb-4">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-75 transition-opacity duration-200" />
                </Link>
              )}
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2"><Link to={`/magazine/article/${article.id}`} className="hover:underline">{article.title}</Link></h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow line-clamp-3">{article.summary || 'No summary available.'}</p>
              <Link to={`/magazine/article/${article.id}`} className="text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-500 font-medium mt-auto self-start">
                Read More &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center min-w-full">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 mx-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 min-w-[100px] text-center text-gray-700 dark:text-gray-300">Page {currentPage + 1} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1 || totalPages === 0}
            className="px-4 py-2 mx-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default GreenAtlasMagazinePage; 
