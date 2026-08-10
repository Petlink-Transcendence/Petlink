import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
	<footer className="footer">
      <div className="footer-content">
        <p> 
          <span className="footer-team"> Built with ❤️ by <span className="footer-brand">PetLink</span> </span>
          <span className="footer-slogan"> Connecting pets, sitters & owners </span>
          <span className="footer-links"> <Link to="/terms-of-service" className="footer-link">Terms of Service</Link> </span>
          <span className="footer-links"> <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link> </span>
        </p>
      </div>
    </footer>
  );
}
