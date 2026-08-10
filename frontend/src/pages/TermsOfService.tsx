import { useEffect } from 'react';

export default function TermsOfService() {
    useEffect(() => {
        document.title = 'Terms of Service | PetLink';
    }, []);
    
    return (
        <div className="w-full mt-[6.25rem] flex bg-[var(--social-bg)] text-white box-border justify-center items-start px-5 py-10 min-h-screen">
            <div className="max-w-[800px] w-full min-h-screen pt-[6.25rem] overflow-y-auto my-8 mx-auto px-8 py-10 bg-white text-[var(--social-bg)] rounded-[12px] shadow-[0_4px_20px_rgba(45,45,52,0.08)] font-sans leading-relaxed">
                <header className="border-b-2 border-[var(--petlink-tan)] pb-4 mb-8">
                    <h1 className="text-4xl font-bold text-[var(--social-bg)] m-0 mb-2">Terms of Service</h1>
                    <p className="text-sm text-[var(--social-bg)] opacity-70 m-0">Last Updated: August 28, 2026</p>
                </header>

                <p className="text-[1.1rem] mb-8 text-[var(--social-bg)]">
                    Welcome to <strong>PetLink</strong>. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
                </p>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">1. Overview of Service</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">
                        PetLink is a social platform designed to connect pet owners with independent pet service providers such as pet sitters, walkers, groomers, and trainers. PetLink acts solely as a venue to facilitate communication and networking between users.
                    </p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">2. Account Registration & User Conduct</h2>
                    <ul className="my-2 mr-0 ml-5 p-0 list-disc marker:text-[var(--petlink-tan)]">
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Account Creation:</strong> You must provide accurate and complete information when creating an account on PetLink.</li>
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Responsibilities:</strong> You are responsible for keeping your account credentials secure and for all activities that occur under your account.</li>
                        <li className="mb-2 text-[var(--social-bg)]"><strong>Community Guidelines:</strong> You agree to treat all members of the PetLink community with respect. You may not upload harmful content, spam, harass other users, or misuse the platform for fraud or unlawful activities.</li>
                    </ul>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">3. User-Generated Content</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">
                        You retain ownership of any photos, text, or profile information you publish on PetLink. By uploading content, you grant PetLink a non-exclusive license to display and distribute that content on the platform to enable core functionality (e.g., displaying your pet pictures or service listings to other users).
                    </p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">4. Relationship Between Users & Service Providers</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">
                        PetLink provides a platform for pet owners and providers to discover and interact with one another. PetLink is not an employer, agency, or insurer for pet service providers. Pet owners and providers are solely responsible for negotiating, agreeing upon, and managing any offline services or care arrangements.
                    </p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">5. Account Termination</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">
                        We reserve the right to suspend or terminate account access for users who violate these Terms of Service or engage in conduct that harms the platform or its community members.
                    </p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">6. Disclaimer & Limitation of Liability</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">
                        PetLink is provided on an "as is" and "as available" basis. While we strive to maintain a safe and reliable network, PetLink makes no guarantees regarding the conduct, safety, or quality of services arranged between users off-platform.
                    </p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">7. Changes to Terms</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">
                        We may update these Terms of Service from time to time. Continued use of PetLink following any updates constitutes acceptance of the new terms.
                    </p>
                </section>

                <section className="mb-8 text-left">
                    <h2 className="text-[1.35rem] font-semibold text-[var(--social-bg)] mb-3">8. Contact Us</h2>
                    <p className="m-0 mb-3 text-[var(--social-bg)]">For any questions regarding these Terms of Service, please reach out to us at <a href="mailto:support@petlink.com" className="text-[var(--social-bg)] font-semibold underline decoration-[var(--petlink-tan)] underline-offset-[3px] transition-colors duration-200 hover:text-[var(--petlink-tan)]">support@petlink.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
