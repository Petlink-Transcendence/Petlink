import './Footer.css'

export default function Footer() {
  return (
	<footer className="footer">
      <div className="footer-content">
        <p> 
          <span className="footer-team"> Built with ❤️ by <span className="footer-brand">PetLink</span> </span>
          <span className="footer-slogan"> Connecting pets, sitters & owners </span>
          <span className="footer-links"> <a href="/terms-of-service" className="footer-link">Terms of Service</a> </span>
          <span className="footer-links"> <a href="/privacy-policy" className="footer-link">Privacy Policy</a> </span>
        </p>
      </div>
    </footer>
  );
}
