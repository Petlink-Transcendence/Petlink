import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <div className="page-content">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </div>
      <Footer />
    </Router>
  );
}

export default App;
