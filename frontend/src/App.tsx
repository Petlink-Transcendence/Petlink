import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from "./components/Footer";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import ChooseRole from './pages/ChooseRole';
import Chat from './pages/Chat';
import Profile from './pages/OwnerProfile';
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import Reviews from './pages/Reviews';
import Bookings from './pages/Bookings';
import SitterProfile from './pages/SitterProfile';
import Search from './pages/Search';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AdminOnlyRoute from './components/AdminOnlyRoute';
import MyProfileRedirect from './components/MyProfileRedirect';
import './App.css';

function App() {
  return (
    <div className="app-container">
    <Router>
      <Header />
      <div className="page-content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

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

          {/* 42 OAuth Callback Route */}
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          <Route path="/choose-role" element={
            <ProtectedRoute>
              <ChooseRole />
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          {/* /profile → redirects to /ownerprofile or /sitterprofile based on user_type */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <MyProfileRedirect />
            </ProtectedRoute>
          } />
          <Route path="/ownerprofile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/ownerprofile/:id" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/sitterprofile" element={
            <ProtectedRoute>
              <SitterProfile />
            </ProtectedRoute>
          } />
          <Route path="/sitterprofile/:profileId" element={
            <ProtectedRoute>
              <SitterProfile />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
              </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminOnlyRoute>
              <Admin />
            </AdminOnlyRoute>
          } />

          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />

          <Route path="/reviews" element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } />

          <Route path="/bookings" element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
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
