import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles = [],children,...rest }) => {
    // If user is not login, redirect to login-page
    const userRole = localStorage.getItem("role");
    if (!userRole) {
        return <Navigate to="/not-found" />;
    }

    // If allowRoles is invalid, redirect to home page
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        
        return <Navigate to="/not-found" />;
    }

    // If user role is valid, render component
    return children;
};

export default PrivateRoute;
