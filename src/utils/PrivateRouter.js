import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({children, element, allowedRoles = [], ...rest }) => {
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
    // return element;
    return children;
};


export default PrivateRoute;
