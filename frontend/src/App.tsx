import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import SitterProfile from './pages/SitterProfile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import './App.css';

function App() {
  return (
    <div className="app-container">
    <Router>
      <Header />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />

          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/sitterprofile" element={
            <ProtectedRoute>
              <SitterProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
 