import { useUser } from './UserContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { token } = useUser();
  return token ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute