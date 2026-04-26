import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login'
import Chat from './pages/Chat'
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <div className="page-content">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
