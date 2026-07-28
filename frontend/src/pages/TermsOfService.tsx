import { useEffect } from 'react';
import './LegalPages.css';

export default function TermsOfService() {
    useEffect(() => {
        document.title = 'Terms of Service | PetLink';
    }, []);
    
    return (
        <div className="container">
            <div className='legal-box'>
                <header className="header">
                    <h1>Terms of Service</h1>
                    <p className="lastUpdated">Last Updated: August 28, 2026</p>
                </header>

                <p className="intro">
                    Welcome to <strong>PetLink</strong>. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
                </p>

                <section className="section">
                    <h2>1. Overview of Service</h2>
                    <p>
                        PetLink is a social platform designed to connect pet owners with independent pet service providers such as pet sitters, walkers, groomers, and trainers. PetLink acts solely as a venue to facilitate communication and networking between users.
                    </p>
                </section>

                <section className="section">
                    <h2>2. Account Registration & User Conduct</h2>
                    <ul>
                        <p><strong>Account Creation:</strong> You must provide accurate and complete information when creating an account on PetLink.</p>
                        <p><strong>Responsibilities:</strong> You are responsible for keeping your account credentials secure and for all activities that occur under your account.</p>
                        <p><strong>Community Guidelines:</strong> You agree to treat all members of the PetLink community with respect. You may not upload harmful content, spam, harass other users, or misuse the platform for fraud or unlawful activities.</p>
                    </ul>
                </section>

                <section className="section">
                    <h2>3. User-Generated Content</h2>
                    <p>
                        You retain ownership of any photos, text, or profile information you publish on PetLink. By uploading content, you grant PetLink a non-exclusive license to display and distribute that content on the platform to enable core functionality (e.g., displaying your pet pictures or service listings to other users).
                    </p>
                </section>

                <section className="section">
                    <h2>4. Relationship Between Users & Service Providers</h2>
                    <p>
                        PetLink provides a platform for pet owners and providers to discover and interact with one another. PetLink is not an employer, agency, or insurer for pet service providers. Pet owners and providers are solely responsible for negotiating, agreeing upon, and managing any offline services or care arrangements.
                    </p>
                </section>

                <section className="section">
                    <h2>5. Account Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate account access for users who violate these Terms of Service or engage in conduct that harms the platform or its community members.
                    </p>
                </section>

                <section className="section">
                    <h2>6. Disclaimer & Limitation of Liability</h2>
                    <p>
                        PetLink is provided on an "as is" and "as available" basis. While we strive to maintain a safe and reliable network, PetLink makes no guarantees regarding the conduct, safety, or quality of services arranged between users off-platform.
                    </p>
                </section>

                <section className="section">
                    <h2>7. Changes to Terms</h2>
                    <p>
                        We may update these Terms of Service from time to time. Continued use of PetLink following any updates constitutes acceptance of the new terms.
                    </p>
                </section>

                <section className="section">
                    <h2>8. Contact Us</h2>
                    <p>For any questions regarding these Terms of Service, please reach out to us at <a href="mailto:support@petlink.com">support@petlink.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
