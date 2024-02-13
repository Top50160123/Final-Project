import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { useUser } from './callback';

function ProtectedRoute({ children }) {

    const { user } = useUserAuth();
    const users = useUser();

    if (!user) {
        return <Navigate to="/" />
    } else if(!users) {
      return <Navigate to="/" />
    }

  return children;
}

export default ProtectedRoute