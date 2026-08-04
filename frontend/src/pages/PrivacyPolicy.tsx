import { useEffect } from 'react';
import './LegalPages.css';

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = 'Privacy Policy | PetLink';
    }, []);

    return (
        <div className="container">
            <div className='legal-box'>
                <header className="header">
                    <h1>Privacy Policy</h1>
                </header>

                <p className="intro">
                    Welcome to <strong>PetLink</strong>! We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and platform to connect with pet owners and service providers.
                </p>

                <section className="section">
                    <h2>1. Information We Collect</h2>
                    <p>To provide you with the best experience on PetLink, we collect the following types of information:</p>
                    <ul>
                        <p><strong>Account & Profile Information:</strong> Name, email address, profile picture, location, and details about your pets or service provider offerings.</p>
                        <p><strong>Basic Public Information:</strong> Certain basic profile details (such as your display name, general location, and public pet details) are visible to everyone on the network to facilitate connections.</p>
                        <p><strong>Usage & Communication Data:</strong> Messages sent between users through our platform and general navigation logs.</p>
                    </ul>
                </section>

                <section className="section">
                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <p>Connect pet owners with nearby pet service providers.</p>
                        <p>Facilitate communication and profile matching on our social network.</p>
                        <p>Maintain network security, prevent abuse, and improve platform functionality.</p>
                        <p>Send you system notifications, account updates, and activity alerts.</p>
                    </ul>
                </section>

                <section className="section">
                    <h2>3. Privacy & Notification Controls</h2>
                    <p>You are in control of your data and experience on PetLink:</p>
                    <ul>
                        <p><strong>Profile Visibility:</strong> You can choose which sections of your profile are publicly visible or restricted through your Account Privacy Settings.</p>
                        <p><strong>Notification Preferences:</strong> You can customize which notifications (e.g., message alerts, connection requests, push updates, social activity) you wish to receive or turn off at any time in your Settings.</p>
                    </ul>
                </section>

                <section className="section">
                    <h2>4. Information Sharing</h2>
                    <p>We <strong>do not</strong> sell your personal data to third parties. We only share information:</p>
                    <ul>
                        <p>With other users as directed by your public profile and interactions on the platform.</p>
                        <p>With service providers (such as hosting and database services) operating under strict privacy agreements.</p>
                        <p>If required by law, regulation, or legal process.</p>
                    </ul>
                </section>

                <section className="section">
                    <h2>5. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse.</p>
                </section>

                <section className="section">
                    <h2>6. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy or your data, please contact us at <a href="mailto:support@petlink.com">support@petlink.com</a>.</p>
                </section>
            </div>
        </div>
    );
};
