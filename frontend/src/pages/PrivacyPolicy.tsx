import { useEffect } from 'react';

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = 'Privacy Policy | PetLink';
    }, []);

    return (
        <div className="w-full mt-[6.25rem] flex bg-[var(--social-bg)] text-white box-border justify-center items-start px-5 py-10 min-h-screen">
            <div className="max-w-[800px] w-full min-h-screen pt-[6.25rem] overflow-y-auto my-8 mx-auto px-8 py-10 bg-white text-[var(--social-bg)] rounded-[12px] shadow-[0_4px_20px_rgba(45,45,52,0.08)] font-sans leading-relaxed">
                <header className="border-b-2 border-[var(--petlink-tan)] pb-4 mb-8">
                    <h1 className="text-4xl font-bold text-[var(--social-bg)] m-0 mb-2">Privacy Policy</h1>
                </header>

                <p className="text-[1.1rem] mb-8 text-[var(--social-bg)]">
                    Welcome to <strong>PetLink</strong>! We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and platform to connect with pet owners and service providers.
                </p>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">1. Information We Collect</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">To provide you with the best experience on PetLink, we collect the following types of information:</p>
                    <ul className="my-2 mr-0 ml-5 p-0 list-disc marker:text-[var(--petlink-tan)]">
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Account & Profile Information:</strong> Name, email address, profile picture, location, and details about your pets or service provider offerings.</li>
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Basic Public Information:</strong> Certain basic profile details (such as your display name, general location, and public pet details) are visible to everyone on the network to facilitate connections.</li>
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Usage & Communication Data:</strong> Messages sent between users through our platform and general navigation logs.</li>
                    </ul>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">2. How We Use Your Information</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">We use your information to:</p>
                    <ul className="my-2 mr-0 ml-5 p-0 list-disc marker:text-[var(--petlink-tan)]">
                        <li className="mb-2 text-[var(--social-bg)]">Connect pet owners with nearby pet service providers.</li>
                        <li className="mb-2 text-[var(--social-bg)]">Facilitate communication and profile matching on our social network.</li>
                        <li className="mb-2 text-[var(--social-bg)]">Maintain network security, prevent abuse, and improve platform functionality.</li>
                        <li className="mb-2 text-[var(--social-bg)]">Send you system notifications, account updates, and activity alerts.</li>
                    </ul>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">3. Privacy & Notification Controls</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">You are in control of your data and experience on PetLink:</p>
                    <ul className="my-2 mr-0 ml-5 p-0 list-disc marker:text-[var(--petlink-tan)]">
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Profile Visibility:</strong> You can choose which sections of your profile are publicly visible or restricted through your Account Privacy Settings.</li>
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Notification Preferences:</strong> You can customize which notifications (e.g., message alerts, connection requests, push updates, social activity) you wish to receive or turn off at any time in your Settings.</li>
                    </ul>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">4. Information Sharing</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">We <strong>do not</strong> sell your personal data to third parties. We only share information:</p>
                    <ul className="my-2 mr-0 ml-5 p-0 list-disc marker:text-[var(--petlink-tan)]">
                        <li className="mb-2 text-[var(--social-bg)]">With other users as directed by your public profile and interactions on the platform.</li>
                        <li className="mb-2 text-[var(--social-bg)]">With service providers (such as hosting and database services) operating under strict privacy agreements.</li>
                        <li className="mb-2 text-[var(--social-bg)]">If required by law, regulation, or legal process.</li>
                    </ul>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">5. Data Security</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse.</p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">6. Contact Us</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">If you have questions about this Privacy Policy or your data, please contact us at <a href="mailto:support@petlink.com" className="text-[var(--social-bg)] font-semibold underline decoration-[var(--petlink-tan)] underline-offset-[3px] transition-colors duration-200 hover:text-[var(--petlink-tan)]">support@petlink.com</a>.</p>
                </section>
            </div>
        </div>
    );
};
