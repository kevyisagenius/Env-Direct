import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService'; // Corrected path

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To check initial auth status

  const loadUserFromToken = useCallback(() => {
    const token = authService.getCurrentUserToken();
    if (token) {
      const userDataFromToken = authService.parseJwt(token);
      if (userDataFromToken) {
        // Check if token is expired (optional but recommended)
        const nowInSeconds = Date.now() / 1000;
        if (userDataFromToken.exp && userDataFromToken.exp < nowInSeconds) {
          console.log("Token expired, logging out.");
          authService.logout(); // Clear expired token
          setCurrentUser(null);
        } else {
          // Set user with token and parsed data (e.g., username, roles)
          // Adjust structure based on what your JWT payload contains (sub = username, roles = roles array)
          setCurrentUser({
            username: userDataFromToken.sub, // Assuming 'sub' claim is username
            roles: userDataFromToken.roles || [], // Assuming 'roles' claim is an array
            token: token,
          });
        }
      } else {
        // Token is invalid or parsing failed
        authService.logout();
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      // After successful login, token is stored by authService. Now update context.
      loadUserFromToken(); // Reload user from the new token
      return data; // Return full response data if needed by caller
    } catch (error) {
      console.error("Login failed in context:", error);
      setCurrentUser(null); // Ensure user is cleared on failed login
      throw error; // Re-throw to be caught by UI
    }
  };

  const register = async (username, email, password) => {
    try {
      // authService.register will throw an error if it fails
      const data = await authService.register(username, email, password);
      // Optionally, log the user in automatically after successful registration
      // Or redirect them to the login page
      // For now, just return the response (e.g., success message)
      return data;
    } catch (error) {
      console.error("Registration failed in context:", error);
      throw error; // Re-throw to be caught by UI
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    // Here you might want to redirect the user to the login page or homepage
    // e.g., window.location.href = '/login'; (or use react-router navigate)
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser, // Boolean: true if currentUser is not null
    isLoading, // For initial auth check
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
}; 