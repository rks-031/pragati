import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || "");
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || "");
    const [qualification, setQualification] = useState(localStorage.getItem('qualification') || "");
    const [studentClass, setStudentClass] = useState(localStorage.getItem('studentClass') || ""); // Added studentClass

    // Sync state with localStorage
    useEffect(() => {
        console.log("AuthContext Loaded - Qualification:", qualification);
    }, [qualification]);

    const login = (name, role, userQualification, userClass) => {
        console.log("Login called with:", { name, role, userQualification, userClass });

        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
        localStorage.setItem('qualification', userQualification || "");
        if (role === 'student') {
            localStorage.setItem('studentClass', userClass || ""); // Store student class
            setStudentClass(userClass || "");
        }

        setUserName(name);
        setUserRole(role);
        setQualification(userQualification || "");
    };

    const logout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('qualification');
        localStorage.removeItem('studentClass'); // Remove student class

        setUserName(null);
        setUserRole(null);
        setQualification(null);
        setStudentClass(null);
    };

    return (
        <AuthContext.Provider value={{ 
            userName, 
            userRole, 
            qualification, 
            studentClass, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
