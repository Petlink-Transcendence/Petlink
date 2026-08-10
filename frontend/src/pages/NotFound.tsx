import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-screen mt-[6.25rem] items-center justify-center px-4 py-8 bg-[var(--bg)] box-border">
      <div className="max-w-[28rem] w-full px-8 py-12 bg-[var(--bg-light)] dark:bg-[#1f2028] border border-[var(--border)] rounded-[1.25rem] shadow-[var(--shadow)] flex flex-col items-center text-center transition-transform duration-300 ease-out">
        <div className="text-[4rem] mb-4">🐾</div>
        <h1 className="text-[6rem] font-[850] m-0 leading-none bg-[var(--petlink-tan)] bg-clip-text text-transparent">404</h1>
        <h2 className="text-[1.6rem] font-bold mt-2 mb-4 text-[var(--text-h)]">Page Not Found</h2>
        <p className="text-[0.95rem] text-[var(--text)] leading-relaxed mb-8">
          Oops! The page you are looking for doesn't exist. It might have wandered off or been moved.
        </p>
        <Link to="/" className="inline-block no-underline bg-[var(--petlink-tan)] text-white px-8 py-3 rounded-[2rem] font-extrabold text-[0.9rem] transition-all duration-200 hover:bg-[var(--social-bg)] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
