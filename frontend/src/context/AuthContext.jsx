import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || "");
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || "");
    const [qualification, setQualification] = useState(localStorage.getItem('qualification') || "");

    // Sync state with localStorage
    useEffect(() => {
        console.log("AuthContext Loaded - Qualification:", qualification);
    }, [qualification]);

    const login = (name, role, userQualification) => {
        console.log("Login called with:", { name, role, userQualification });

        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
        localStorage.setItem('qualification', userQualification || ""); // Default empty string if undefined

        setUserName(name);
        setUserRole(role);
        setQualification(userQualification || "");
    };

    const logout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('qualification');

        setUserName(null);
        setUserRole(null);
        setQualification(null);
    };

    return (
        <AuthContext.Provider value={{ 
            userName, 
            userRole, 
            qualification,
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
