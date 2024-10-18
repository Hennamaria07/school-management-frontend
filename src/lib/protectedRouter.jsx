import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRouter = ({isAuthenticated, children, role}) => {
    if (!isAuthenticated) {
        return <Navigate to='/' />
    } 
    return children;
}


export default ProtectedRouter

export const AdminProtectedRouter = ({isAuthenticated, children, role}) => {
    if (!isAuthenticated) {
        return <Navigate to='/' />
    } 
    if(isAuthenticated && role === 'admin') {
        return children
    }
}
