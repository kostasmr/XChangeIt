
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UpdatePage from './pages/UpdatePage';
import DeletePage from './pages/DeletePage';
import ProtectedRoute from './ProtectedRoutes';

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/update" element={<ProtectedRoute><UpdatePage /></ProtectedRoute>} />
        <Route path="/delete" element={<ProtectedRoute><DeletePage /></ProtectedRoute>} />
      </Routes>
        {/* <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/delete" element={<DeletePage />} />
        </Routes> */}
    </>
  )
}

export default App
