const API_URL = '/api/auth';

const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    // Try to parse error message from backend, otherwise use a generic one
    let errorMessage = 'Registration failed. Please check your input.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore if response is not JSON or other parsing error
    }
    throw new Error(errorMessage);
  }
  // Assuming backend might not return a body for successful registration or just a success message
  try {
    return await response.json(); 
  } catch (e) {
    return { success: true }; // Fallback if no JSON body
  }
};

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    let errorMessage = 'Invalid username or password.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore
    }
    throw new Error(errorMessage);
  }
  const data = await response.json();
  if (data.token) { 
    localStorage.setItem('userToken', data.token);
  } else {
    // This case should ideally not happen if login is successful and backend guarantees a token
    console.error("Login successful but no token received."); 
    throw new Error("Login succeeded but no token was provided.");
  }
  return data; // Contains token and potentially user info like username, roles
};

const logout = () => {
  localStorage.removeItem('userToken');
  // Potentially also call a backend /logout endpoint if you have one to invalidate server-side session/token
};

const getCurrentUserToken = () => {
  return localStorage.getItem('userToken');
};

const parseJwt = (token) => {
  if (!token) {
    return null;
  }
  try {
    // Get the payload part of the token
    const base64Url = token.split('.')[1];
    // Replace URL-specific characters and decode
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
};

const authenticatedFetch = async (url, options = {}) => {
  const token = getCurrentUserToken();

  const headers = {
    ...options.headers,
    'Content-Type': options.headers && options.headers['Content-Type'] ? options.headers['Content-Type'] : 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired. Log out the user.
    // Avoid an infinite loop if the logout process itself tries to make an authenticated call
    // or if multiple components react to logout simultaneously.
    // A simple flag or checking if already redirecting might be needed in a more complex app.
    logout(); // Clear token and user state from AuthContext via authService
    // Optionally, redirect to login page or show a session expired message
    // For now, just throwing an error that can be caught by the caller.
    // The AuthContext will clear the user, and ProtectedRoutes should redirect.
    throw new Error('Session expired or unauthorized. Please log in again.');
  }

  // Do not assume all non-OK responses are JSON. Handle based on Content-Type or try/catch.
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Response was not JSON, or other parsing error. Use the status text or generic message.
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // If response is OK and has Content-Type application/json, try to parse it.
  // Otherwise, for non-JSON responses (e.g., 204 No Content), return the response object itself or handle as needed.
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  // For 204 No Content or other non-JSON success responses
  if (response.ok && response.status === 204) {
    return { success: true, status: 204 }; // Or simply return undefined/null based on API design
  }

  return response; // Fallback for other content types or if no specific handling is needed
};

const authService = {
  register,
  login,
  logout,
  getCurrentUserToken,
  parseJwt,
  authenticatedFetch,
};

export default authService; 