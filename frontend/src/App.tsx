import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from "./components/Footer";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Profile from './pages/OwnerProfile';
import Notifications from "./pages/Notifications";
import Reviews from './pages/Reviews';
import OtherPersonReviews from './pages/OtherPersonReviews';
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
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />

          <Route path="/reviews" element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } />

          <Route path="/reviews/:personName" element={
            <ProtectedRoute>
              <OtherPersonReviews />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
    <Footer />
    </div>
  );
}

export default App;
