import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addToCart = (room, checkIn, checkOut) => {
    const existingItem = cartItems.find(item => item.room.id === room.id);

    if (existingItem) {
      setCartItems(prev =>
        prev.map(item =>
          item.room.id === room.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [
        ...prev,
        { room, quantity: 1, checkIn, checkOut }
      ]);
    }
  };

  const removeFromCart = (roomId) => {
    setCartItems(prev =>
      prev.filter(item => item.room.id !== roomId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const persistUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const data = response.data;
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      persistUser(userData, data.token);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password, role = 'USER') => {
    try {
      const response = await api.signup(name, email, password, role);
      const data = response.data;
      if (data.token) {
        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        persistUser(userData, data.token);
      }
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        user,
        login,
        signup,
        logout,
        isLoading,
        setIsLoading
      }}
    >
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};