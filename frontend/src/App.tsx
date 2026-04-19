import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login'
import './App.css'

function App() {
  return(
    <Router>
      <nav style={{padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link style={{ marginRight: "1rem" }} to="/home">Home</Link>
        <Link to="/">Login</Link>
      </nav>

      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
