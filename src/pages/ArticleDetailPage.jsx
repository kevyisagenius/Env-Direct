import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  LinkedinShareButton, LinkedinIcon,
  EmailShareButton, EmailIcon,
  WhatsappShareButton, WhatsappIcon,
} from 'react-share';
import { useAuth } from '../context/AuthContext.jsx';
import authService from '../services/authService';

// Helper to format date (optional)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Invalid Date';
  }
};

const ArticleDetailPage = () => {
  const { articleId } = useParams(); // Get articleId from URL parameter
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth context
  const { currentUser } = useAuth();

  // State for comments
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [commentError, setCommentError] = useState(null);

  // State for new comment form
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [submitCommentError, setSubmitCommentError] = useState(null);

  // State for Related Articles
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(true);
  const [relatedError, setRelatedError] = useState(null);

  const fetchArticleAndComments = useCallback(async () => {
    if (!articleId) return;
    setIsLoading(true);
    setError(null);
    setIsCommentsLoading(true);
    setCommentError(null);
    // Reset related articles for the new article being viewed
    setRelatedArticles([]);
    setIsRelatedLoading(true);
    setRelatedError(null);

    try {
      // Fetch main article
      const articleResponse = await fetch(`/api/articles/${articleId}`);
      if (!articleResponse.ok) {
        if (articleResponse.status === 404) throw new Error('Article not found.');
        throw new Error(`HTTP error fetching article! status: ${articleResponse.status}`);
      }
      const articleData = await articleResponse.json();
      setArticle(articleData);
      setIsLoading(false); // Article loaded

      // Fetch comments for the loaded article
      const commentsResponse = await fetch(`/api/articles/${articleId}/comments`);
      if (!commentsResponse.ok) {
        throw new Error(`HTTP error fetching comments! status: ${commentsResponse.status}`);
      }
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
      setIsCommentsLoading(false); // Comments loaded

      // Fetch related articles for the loaded article
      if (articleData && articleData.id) { // Ensure we have an article ID
        const relatedResponse = await fetch(`/api/articles/${articleData.id}/related?count=3`); // Fetch 3 related articles
        if (!relatedResponse.ok) {
          throw new Error(`HTTP error fetching related articles! status: ${relatedResponse.status}`);
        }
        const relatedData = await relatedResponse.json();
        setRelatedArticles(relatedData || []);
        setIsRelatedLoading(false); // Related articles loaded
      }

    } catch (e) {
      console.error("Failed to fetch article details or related content:", e);
      setError(e.message); // Set main error state
      // Also ensure loading states are false if an error occurs mid-process
      setIsLoading(false);
      setIsCommentsLoading(false);
      setIsRelatedLoading(false);
      // Optionally set specific errors
      if (!article) setCommentError(e.message); // If article loaded but comments failed etc.
      if (!article) setRelatedError(e.message);
    }
  }, [articleId]);

  useEffect(() => {
    fetchArticleAndComments();
  }, [fetchArticleAndComments]);

  // Prefill author name if user is logged in
  useEffect(() => {
    if (currentUser) {
      setNewCommentAuthor(currentUser.username);
    }
    // If user logs out while on the page, clear the author field if it was prefilled
    // (or leave it as is, depending on desired UX)
    // else {
    //   setNewCommentAuthor(\'\'); 
    // }
  }, [currentUser]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    // User's name is pre-filled from currentUser if logged in, or from newCommentAuthor state otherwise.
    // The actual authorName sent to backend will be from newCommentAuthor state, 
    // which is set by currentUser.username if logged in.
    const authorNameToSubmit = newCommentAuthor.trim();

    if (!authorNameToSubmit || !newCommentContent.trim()) {
      setSubmitCommentError('Name and comment cannot be empty.');
      return;
    }
    setIsSubmittingComment(true);
    setSubmitCommentError(null);

    try {
      // Use authenticatedFetch for submitting the comment
      await authService.authenticatedFetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        // Content-Type is set to application/json by default in authenticatedFetch if not specified
        body: JSON.stringify({ 
          authorName: authorNameToSubmit, // Send the determined author name
          content: newCommentContent.trim() 
        }),
      });

      // Clear form - only clear content, author name might be from logged-in user
      // setNewCommentAuthor(\'\'); // No longer clearing author if it comes from currentUser
      setNewCommentContent('');
      
      // Re-fetch comments after successful submission using regular fetch (or authenticatedFetch if GET comments is protected)
      // Assuming GET /comments is not protected for now.
      const commentsResponse = await fetch(`/api/articles/${articleId}/comments`);
      if (!commentsResponse.ok) throw new Error(`HTTP error fetching comments! status: ${commentsResponse.status}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
      setCommentError(null);
    } catch (e) {
      console.error("Failed to submit comment:", e);
      setSubmitCommentError(e.message); 
      // If error was due to 401 (handled by authenticatedFetch), user is logged out.
      // The UI (Navbar, ProtectedRoutes) should react to this.
    }
    setIsSubmittingComment(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center"><p>Loading article...</p></div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600"><p>Error: {error}</p></div>;
  }

  if (!article) {
    return <div className="p-8 text-center"><p>Article not found.</p></div>;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article ? article.title : 'Check out this article';

  return (
    <div className="bg-white dark:bg-slate-900 py-8 md:py-12">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full aspect-[16/9] object-cover rounded-xl shadow-xl mb-8"
          />
        )}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              {article.author && <p>By <span className="font-semibold text-slate-700 dark:text-slate-300">{article.author}</span></p>}
              {article.author && <span className="hidden sm:inline">&bull;</span>}
              <p className="mt-1 sm:mt-0">Published: <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time></p>
            </div>
            {/* Social Share Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 hidden sm:block">Share:</span>
              <TwitterShareButton url={shareUrl} title={shareTitle} className="hover:opacity-75 transition-opacity">
                <TwitterIcon size={28} round />
              </TwitterShareButton>
              <FacebookShareButton url={shareUrl} quote={shareTitle} className="hover:opacity-75 transition-opacity">
                <FacebookIcon size={28} round />
              </FacebookShareButton>
              <LinkedinShareButton url={shareUrl} title={shareTitle} summary={article.summary || ''} source="Environment Direct" className="hover:opacity-75 transition-opacity">
                <LinkedinIcon size={28} round />
              </LinkedinShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle} separator="::" className="hover:opacity-75 transition-opacity">
                <WhatsappIcon size={28} round />
              </WhatsappShareButton>
              <EmailShareButton url={shareUrl} subject={shareTitle} body="Check out this article:" className="hover:opacity-75 transition-opacity">
                <EmailIcon size={28} round />
              </EmailShareButton>
            </div>
          </div>
          {article.updatedAt && article.updatedAt !== article.createdAt && (
            <p className="text-xs italic text-slate-500 dark:text-slate-400 mb-6">(Updated: <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>)</p>
          )}
        </header>

        <div 
          className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none article-content text-slate-700 dark:text-slate-300 prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-a:text-green-600 dark:prose-a:text-green-400 hover:prose-a:text-green-700 dark:hover:prose-a:text-green-500 prose-strong:text-slate-800 dark:prose-strong:text-slate-200 mb-8" 
          dangerouslySetInnerHTML={{ __html: article.content || '<p>Content not available.</p>' }} 
        />

        {(article.categories?.length > 0 || article.tags?.length > 0) && (      
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            {article.categories?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Categories:</h3>
                <div className="flex flex-wrap gap-3">
                  {article.categories.map(category => (
                    <Link 
                      key={category.id} 
                      to={`/green-atlas-magazine?category=${encodeURIComponent(category.name)}`}
                      className="inline-block px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-600/30 transition-colors shadow-sm"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {article.tags?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map(tag => (
                    <Link 
                      key={tag.id} 
                      to={`/green-atlas-magazine?tag=${encodeURIComponent(tag.name)}`}
                      className="inline-block px-3 py-1.5 bg-sky-100 text-sky-700 dark:bg-sky-700/20 dark:text-sky-300 rounded-full text-sm font-medium hover:bg-sky-200 dark:hover:bg-sky-600/30 transition-colors shadow-sm"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </footer>
        )}

        <div className="mt-12 pt-8 text-center border-t border-slate-200 dark:border-slate-700">
          <Link 
            to="/green-atlas-magazine"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 dark:ring-offset-slate-900 transition-colors"
          >
            &larr; Back to All Articles
          </Link>
        </div>
      </article>

      {/* Comments Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Comments ({comments.length})</h2>
        
        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Leave a Comment</h3>
          {submitCommentError && (
            <div className="mb-3 p-3 text-sm text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-700/30 rounded-md">
              Error: {submitCommentError}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="commentAuthor" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
            <input 
              type="text" 
              id="commentAuthor" 
              name="commentAuthor"
              value={currentUser ? currentUser.username : newCommentAuthor}
              onChange={(e) => !currentUser && setNewCommentAuthor(e.target.value)}
              readOnly={!!currentUser}
              required 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:text-slate-100"
              disabled={!!currentUser}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="commentContent" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Comment</label>
            <textarea 
              id="commentContent" 
              name="commentContent"
              rows="4" 
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:text-slate-100"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmittingComment} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 dark:ring-offset-slate-900"
          >
            {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>

        {/* Display Comments */}
        {isCommentsLoading && <p className="text-slate-600 dark:text-slate-400">Loading comments...</p>}
        {commentError && <p className="text-red-600"><span className="font-semibold">Error loading comments:</span> {commentError}</p>}
        {!isCommentsLoading && !commentError && comments.length === 0 && (
          <p className="text-slate-600 dark:text-slate-400">No comments yet. Be the first to comment!</p>
        )}
        {!isCommentsLoading && !commentError && comments.length > 0 && (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mr-3">{comment.authorName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400"><time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time></p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Articles Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">You Might Also Like</h2>
          {isRelatedLoading && <p className="text-slate-600 dark:text-slate-400">Loading related articles...</p>}
          {relatedError && <p className="text-red-600"><span className="font-semibold">Error loading related articles:</span> {relatedError}</p>}
          {!isRelatedLoading && !relatedError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <div key={related.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  {related.imageUrl && (
                    <Link to={`/magazine/article/${related.id}`}>
                      <img 
                        src={related.imageUrl} 
                        alt={related.title} 
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    </Link>
                  )}
                  <h3 className="text-md font-semibold text-green-700 dark:text-green-400 mb-1 line-clamp-2">
                    <Link to={`/magazine/article/${related.id}`} className="hover:underline">
                      {related.title}
                    </Link>
                  </h3>
                  {/* Optionally, display a short summary or categories/tags here */}
                  {/* <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{related.summary}</p> */}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {/* Display loading/error specifically for related articles if needed, even if section is hidden */}
      {isRelatedLoading && articleId && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 text-center"><p className="text-slate-600 dark:text-slate-400">Loading related articles...</p></div>
      )}
      {!isRelatedLoading && relatedError && articleId && (
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 text-center"><p className="text-red-600"><span className="font-semibold">Could not load related articles:</span> {relatedError}</p></div>
      )}
    </div>
  );
};

export default ArticleDetailPage; 