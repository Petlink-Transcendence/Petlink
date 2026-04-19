import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      {/* This is a simple Navigation bar that stays visible on all pages */}
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link style={{ marginRight: "1rem" }} to="/home">Home</Link>
      </nav>

      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
