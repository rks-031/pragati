import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  const login = (name) => {
    localStorage.setItem('userName', name);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('userName');
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);