import './Footer.css'

export default function Footer() {
  return (
	<footer className="footer">
      <div className="footer-content">
        <p className="footer-brand">🐾 PetLink</p>

        <p className="footer-team">
          Built with ❤️ by <span className="team-name">[Team Name]</span>
        </p>

        <p className="footer-small">
          Connecting pets, sitters & owners
        </p>
      </div>
    </footer>
  );
}
