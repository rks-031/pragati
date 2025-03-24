import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { userName, userRole } = useAuth();

    if (!userName || !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;