import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState([false]);

  const login = (data) => {
    setIsAuthenticated([true, data]);
  };

  const logout = () => {
    setIsAuthenticated([false]);
  };

  const fetchdatalogin = async () => {
    const token = localStorage.getItem('whosmydoc')
    console.log('Checking token:', token)
    
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        const headers = {
          "Authorization": `Bearer ${token}`
        };
        
        const result = await axios.post(API_ENDPOINTS.LOGIN, {}, { headers });
        console.log('Token verification result:', result.data);
        
        const { status, user } = result.data;
        if (status) {
          setIsAuthenticated([true, user]);
        } else {
          // Invalid token, remove it
          localStorage.removeItem('whosmydoc');
          setIsAuthenticated([false]);
        }
      } catch (error) {
        console.log('Token verification error:', error);
        // Invalid token, remove it
        localStorage.removeItem('whosmydoc');
        setIsAuthenticated([false]);
      }
    } else {
      // No token found
      setIsAuthenticated([false]);
    }
  }
  useEffect(() => {
    fetchdatalogin()
  }, [])
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };